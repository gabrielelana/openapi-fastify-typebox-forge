## Derive Fastify types from an OpenAPI specification

If you design your API by creating the OpenAPI specification first then if you
use [Fastify](https://fastify.dev/) with
[TypeBox](https://github.com/sinclairzx81/typebox) a type provider then you will
find this project useful.

Given the OpenAPI specification (`-i` or `--openapi` command line argument) it
will generate in a directory of your choosing (`-o` or `--out` command line
argument) the following files.

- For each [operation](https://spec.openapis.org/oas/latest.html#operation-object)
  - For each component (request body, response body, path parameters, query
    string, request headers) with a
    [schema](https://spec.openapis.org/oas/latest.html#schema-object)
    - File named `{operationID}.{componentName}.json` with the extracted JSON schema (ex. `ping.RequestBody.json`)
    - File named `{operationID}.{componentName}.ts` with the TypeBox translation
      of the schema (ex. `ping.RequestBody.ts`) (courtesy of
      [schema2typebox](https://github.com/xddq/schema2typebox))
  - File named `{operationID}.Fastify.ts` with all the code/types exported as
    needed by Fastify's TypeBox type provider.

It will be better to generate the code in `node_modules` directory as
[Prisma](https://www.prisma.io) does.

Let's say that we are using [this example](./resources/examples/example.json)
 and we generate the code in `node_modules/.openapi/` directory, then the
 following files will be generated

```console
❯ ll .tmp/.tg/example
total 64
drwxrwxr-x 2 coder coder 4096 Jul 25 16:07 .
drwxrwxr-x 4 coder coder 4096 Jul 25 16:07 ..
-rw-rw-r-- 1 coder coder  126 Jul 25 16:07 inc.200.ResponseBody.json
-rw-rw-r-- 1 coder coder  514 Jul 25 16:07 inc.200.ResponseBody.ts
-rw-rw-r-- 1 coder coder  802 Jul 25 16:07 inc.400.ResponseBody.json
-rw-rw-r-- 1 coder coder  474 Jul 25 16:07 inc.400.ResponseBody.ts
-rw-rw-r-- 1 coder coder 1036 Jul 25 16:07 inc.500.ResponseBody.json
-rw-rw-r-- 1 coder coder  474 Jul 25 16:07 inc.500.ResponseBody.ts
-rw-rw-r-- 1 coder coder  518 Jul 25 16:07 inc.Fastify.ts
-rw-rw-r-- 1 coder coder  119 Jul 25 16:07 inc.RequestBody.json
-rw-rw-r-- 1 coder coder  509 Jul 25 16:07 inc.RequestBody.ts
-rw-rw-r-- 1 coder coder   41 Jul 25 16:07 ping.200.ResponseBody.json
-rw-rw-r-- 1 coder coder  494 Jul 25 16:07 ping.200.ResponseBody.ts
-rw-rw-r-- 1 coder coder 1036 Jul 25 16:07 ping.500.ResponseBody.json
-rw-rw-r-- 1 coder coder  474 Jul 25 16:07 ping.500.ResponseBody.ts
-rw-rw-r-- 1 coder coder  309 Jul 25 16:07 ping.Fastify.ts
```

And use can use them in your code in the following way

```TypeScript
import * as ping from '.openapi/ping.Fastify'

// ...
app.get('/ping', { schema: ping.T }, (_request, reply) => {
  reply.code(200).send('pong')
})
```

Where `app` is a `FastifyInstance`, then `request` and `reply` will be properly
typed (ex. If you try to reply with something different than `"pong"` you should
se the type checker complaining)

### How-To: Install

```console
npm install -g gabrielelana/openapi-fastify-typebox-forge
```

### How-To: Use

```console
openapi-fastify-typebox-forge -i resources/examples/example.json -o /tmp/example
```

### How-To: Use without installing it globally

```console
npx gabrielelana/openapi-fastify-typebox-forge -i resources/examples/example.json -o /tmp/example
```

### Roadmap

- [ ] handle query strings
- [ ] handle path parameters
- [ ] handle request headers
- [ ] add detailed log of what it's doing, only with `q` or `--quiet` flags then suppress them
- [ ] only with  `-d` or `--debug` flags print full exception on STDERR
- [ ] add tests
