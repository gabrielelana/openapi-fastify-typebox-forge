#! /usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import pkg from '@root/package.json'
import oasSchema from '@schemas/openapi-3_1-schema.json'
import ajv from 'ajv'
import addFormats from 'ajv-formats'
import { Command } from 'commander'
import type { OpenAPIV3_1 as OASV31 } from 'openapi-types'
import { schema2typebox } from 'schema2typebox'
import { Project } from 'ts-morph'
import ts from 'typescript'

const changeCaseLazy = import('change-case')

const httpMethods = ['get', 'put', 'post', 'delete', 'patch', 'options', 'trace', 'head'] as const

type Operation = OASV31.OperationObject & {
  path: string
  method: (typeof httpMethods)[number]
}

type CommandOptions = { openapi: string; out: string }

type TypeBoxComponents = {
  operationId: string
  body: string | undefined
  query: string | undefined
  response: Record<string, string>
}

const program = new Command()

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-i, --openapi <file>', 'OpenAPI specification file in JSON format')
  .option('-o, --out <dir>', 'Directory where to save the generated code')
  .parse(process.argv)

const options = program.opts()

if (options.openapi === undefined || options.out === undefined) {
  program.outputHelp()
}

handle(program, options as CommandOptions)

async function handle(program: Command, opts: CommandOptions) {
  const sourceFileName = opts.openapi as string
  const destinationDirectoryName = options.out as string

  try {
    await prepareDestination(destinationDirectoryName)
    const spec = await readSpecificationFile(sourceFileName)
    const operations = collectOperations(spec)

    const operationsTypeBoxComponents = await generateTypeBoxComponents(
      operations,
      destinationDirectoryName,
    )

    for (const operationTypeBoxComponents of operationsTypeBoxComponents) {
      await generateTypeBoxFastify(operationTypeBoxComponents, destinationDirectoryName)
    }

    // Remove unused imports left by schema2typebox
    const project = new Project()
    project.addSourceFilesAtPaths(path.join(destinationDirectoryName, '/*.ts'))
    for (const sourceFile of project.getSourceFiles()) {
      sourceFile.organizeImports()
      await sourceFile.save()
    }
  } catch (e) {
    // TODO: better error rendering with chalk
    console.error(e)
    program.outputHelp()
    process.exit(1)
  }
}

async function generateTypeBoxComponents(
  operations: Operation[],
  destinationDirectoryName: string,
): Promise<TypeBoxComponents[]> {
  const operationIds: Set<string> = new Set()
  const operationsTypeBoxComponents: TypeBoxComponents[] = []
  for (const operation of operations) {
    const typeBoxComponents = await generateTypeBoxComponentsForOperation(
      operation,
      destinationDirectoryName,
    )
    if (operationIds.has(typeBoxComponents.operationId)) {
      throw new Error(`Duplicated operationId found: ${typeBoxComponents.operationId}`)
    }
    operationsTypeBoxComponents.push(typeBoxComponents)
  }
  return operationsTypeBoxComponents
}

async function generateTypeBoxComponentsForOperation(
  operation: Operation,
  destinationDirectoryName: string,
): Promise<TypeBoxComponents> {
  const changeCase = await changeCaseLazy

  const operationId =
    operation.operationId ||
    changeCase.camelCase(
      operation.path
        .replace('/', '_')
        .replace(/[\[\]]/, '')
        .replace('^_', ''),
    )

  const res: TypeBoxComponents = {
    operationId,
    body: undefined,
    query: undefined,
    response: {},
  }

  // Request
  // handle `${op.id}.RequestBody.json`
  let requestSchema: OASV31.SchemaObject | undefined = undefined
  const requestObject = notRef(operation.requestBody)?.content
  if (requestObject !== undefined) {
    const entries = Object.entries(requestObject)
    if (entries.length > 1) {
      throw new Error(
        `Only one Content-Type per operation request is supported, request in operation ${operationId} has more`,
      )
    }
    whenDefined(entries[0], ([_mediaType, mediaTypeObject]) => {
      // TODO: add _mediaType as constraint in Headers
      requestSchema = notRef(mediaTypeObject.schema)
    })
  }

  // Parameters in QueryString
  // handle `${op.id}.QueryString.json`
  // TODO: in === 'path' for PathParameters.json
  // TODO: in === 'header' for HeaderParameters.json
  const queryStringParametersSchema: Record<string, OASV31.SchemaObject> = {}
  whenDefined(operation.parameters, (parameters) => {
    parameters.forEach((parameter) => {
      whenDefined(notRef(parameter), (parameter) => {
        if (parameter.in === 'query') {
          // TODO: we should warning the user when a schema is a ref because we do not support refs
          whenDefined(notRef(parameter.schema), (schema) => {
            // TODO: fix notRef which is not working in this case, don't know why
            if (!('$ref' in schema)) {
              queryStringParametersSchema[parameter.name] = schema
            }
          })
        }
      })
    })
  })

  // Responses
  // handle `${op.id}.${status}.ResponseBody.json`
  const responsesSchema: Record<string, OASV31.SchemaObject> = {}
  whenDefined(operation.responses, (responses) => {
    Object.entries(responses).forEach(([statusCode, responseObject]) => {
      whenDefined(notRef(responseObject), (responseObject) => {
        whenDefined(responseObject.content, (contentObject) => {
          const entries = Object.entries(contentObject)
          if (entries.length > 1) {
            throw new Error(
              `Only one Content-Type per operation response is supported, response in operation ${operationId} has more`,
            )
          }
          whenDefined(entries[0], ([_mediaType, mediaTypeObject]) => {
            whenDefined(mediaTypeObject.schema, (schema) => {
              responsesSchema[statusCode] = schema
            })
          })
        })
      })
    })
  })

  if (requestSchema) {
    res.body = await writeComponentSchemas(
      requestSchema,
      operationId,
      'RequestBody',
      destinationDirectoryName,
    )
  }

  if (Object.keys(queryStringParametersSchema).length > 0) {
    const schema: OASV31.SchemaObject = {
      type: 'object',
      properties: queryStringParametersSchema,
    }
    res.query = await writeComponentSchemas(
      schema,
      operationId,
      'QueryString',
      destinationDirectoryName,
    )
  }

  for (const statusCode in responsesSchema) {
    res.response[statusCode] = await writeComponentSchemas(
      ensureDefined(responsesSchema[statusCode]),
      operationId,
      `${statusCode}.ResponseBody`,
      destinationDirectoryName,
    )
  }

  return res
}

async function writeComponentSchemas(
  schema: OASV31.SchemaObject,
  operationId: string,
  componentName: string,
  destinationDirectory: string,
): Promise<string> {
  const componentId = `${operationId}.${componentName}`
  const schemaFileName = `${componentId}.json`
  const typeBoxFileName = `${componentId}.ts`

  const schemaContent = JSON.stringify(schema, null, 2)
  await fs.writeFile(path.join(destinationDirectory, schemaFileName), schemaContent)
  const typeBoxContent = await schema2typebox({ input: schemaContent })
  await fs.writeFile(path.join(destinationDirectory, typeBoxFileName), typeBoxContent)
  return componentId
}

async function generateTypeBoxFastify(
  components: TypeBoxComponents,
  _destinationDirectory: string,
): Promise<void> {
  const nodes: ts.Statement[] = []

  // Imports
  whenDefined(components.body, (path) =>
    nodes.push(generateImport(`./${path}`, componentName(path))),
  )
  whenDefined(components.query, (path) => {
    nodes.push(generateImport(`./${path}`, componentName(path)))
  })
  for (const statusCode in components.response) {
    const path = ensureDefined(components.response[statusCode])
    nodes.push(generateImport(`./${path}`, `${componentName(path)}${statusCode}`))
  }

  // Export types
  const exportTypeFields: ts.TypeElement[] = []
  whenDefined(components.body, (path) =>
    exportTypeFields.push(generateTypeExport('body', componentName(path))),
  )
  whenDefined(components.query, (path) =>
    exportTypeFields.push(generateTypeExport('query', componentName(path))),
  )
  const exportTypeResponseFields: ts.TypeElement[] = []
  for (const statusCode in components.response) {
    const path = ensureDefined(components.response[statusCode])
    exportTypeResponseFields.push(
      generateTypeExport(statusCode, `${componentName(path)}${statusCode}`),
    )
  }
  exportTypeFields.push(
    ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier('response'),
      undefined,
      ts.factory.createTypeLiteralNode(exportTypeResponseFields),
    ),
  )
  nodes.push(
    ts.factory.createTypeAliasDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier('T'),
      undefined,
      ts.factory.createTypeLiteralNode(exportTypeFields),
    ),
  )

  // Export values
  const exportFields: ts.ObjectLiteralElementLike[] = []
  whenDefined(components.body, (path) =>
    exportFields.push(generateExport('body', componentName(path))),
  )
  whenDefined(components.query, (path) =>
    exportFields.push(generateExport('query', componentName(path))),
  )
  const exportResponseFields: ts.ObjectLiteralElementLike[] = []
  for (const statusCode in components.response) {
    const path = ensureDefined(components.response[statusCode])
    exportResponseFields.push(generateExport(statusCode, `${componentName(path)}${statusCode}`))
  }
  exportFields.push(
    ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier('response'),
      ts.factory.createObjectLiteralExpression(exportResponseFields),
    ),
  )
  nodes.push(
    ts.factory.createVariableStatement(
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createVariableDeclarationList([
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier('T'),
          undefined,
          undefined,
          ts.factory.createObjectLiteralExpression(exportFields),
        ),
      ]),
    ),
  )

  const code = formatCode(nodes)
  await fs.writeFile(path.join(_destinationDirectory, `${components.operationId}.Fastify.ts`), code)
}

function generateTypeExport(fieldName: string, alias: string) {
  return ts.factory.createPropertySignature(
    undefined,
    ts.factory.createIdentifier(fieldName),
    undefined,
    ts.factory.createTypeReferenceNode(
      ts.factory.createQualifiedName(
        ts.factory.createIdentifier(alias),
        ts.factory.createIdentifier('T'),
      ),
      undefined,
    ),
  )
}

function generateExport(fieldName: string, alias: string) {
  return ts.factory.createPropertyAssignment(
    ts.factory.createIdentifier(fieldName),
    ts.factory.createPropertyAccessExpression(
      ts.factory.createIdentifier(alias),
      ts.factory.createIdentifier('T'),
    ),
  )
}

function generateImport(path: string, alias: string) {
  return ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      false,
      undefined,
      ts.factory.createNamespaceImport(ts.factory.createIdentifier(alias)),
    ),
    ts.factory.createStringLiteral(path),
    undefined,
  )
}

function componentName(componentImportName: string): string {
  return ensureDefined(componentImportName.split('.').reverse().shift())
}

function formatCode(nodes: ts.Statement[]) {
  const resultFile = ts.createSourceFile(
    'source.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

  const source = ts.factory.createSourceFile(
    nodes,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  )

  return printer.printNode(ts.EmitHint.Unspecified, source, resultFile)
}

// OAS

async function readSpecificationFile(fileName: string): Promise<OASV31.Document> {
  try {
    await fs.access(fileName, fs.constants.F_OK | fs.constants.R_OK)
    const content = await fs.readFile(fileName).then((f) => f.toString())
    const data = JSON.parse(content)

    const v = new ajv({ allErrors: true, strict: false, logger: false })
    addFormats(v)
    v.addSchema(oasSchema)
    const validator = v.compile(oasSchema)
    const isValid = validator(data)

    if (isValid) {
      return data as OASV31.Document
    }
    throw new Error('Not a valid specification file')
  } catch (e) {
    throw new Error('Failed to read specification file', { cause: e })
  }
}

function collectOperations(oas: OASV31.Document): Operation[] {
  const res: Operation[] = []
  Object.entries(oas.paths || {}).forEach(([path, pathItem]) => {
    httpMethods.forEach((method) => {
      if (pathItem !== undefined && pathItem[method] !== undefined) {
        res.push({
          path,
          method,
          ...pathItem[method],
        })
      }
    })
  })
  return res
}

// Utilities

async function prepareDestination(directoryName: string): Promise<void> {
  try {
    const directory = path.join(process.cwd(), directoryName)
    await fs.rm(directory, { recursive: true, force: true })
    await fs.mkdir(directory, { recursive: true, mode: 0o775 })
  } catch (e) {
    throw new Error('Failed to create destination directory', { cause: e })
  }
}

function ensureDefined<T>(x: T | undefined | null, message?: string): T {
  if (x === undefined || x === null) {
    throw new Error(message || "Something is undefined when it wasn't supposed to be")
  }
  return x
}

function whenDefined<T, V>(x: T | undefined, f: (x: T) => V): V | undefined {
  if (x === undefined) {
    return undefined
  }
  return f(x)
}

function notRef<T, U>(maybeReference: OASV31.ReferenceObject | T | U | undefined): T | U | undefined
function notRef<T>(maybeReference: OASV31.ReferenceObject | T | undefined): T | undefined
function notRef(maybeReference: unknown) {
  if (
    maybeReference === undefined ||
    maybeReference === null ||
    (typeof maybeReference === 'object' && '$ref' in maybeReference)
  ) {
    return undefined
  }
  return maybeReference
}
