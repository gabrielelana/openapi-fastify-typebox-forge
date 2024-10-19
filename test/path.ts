import type * as Path from './path/PathParametersExample.Fastify'
import type { Equal, Expand, Expect } from './types'

type Given = Expand<Path.T>

type Expected = {
  params: {
    id: number
  }
}

export type _ = [Expect<Equal<Given, Expected>>]
