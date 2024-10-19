import type * as Headers from './headers/HeadersExample.Fastify'
import type { Equal, Expand, Expect } from './types'

type Given = Expand<Headers.T>

type Expected = {
  headers: {
    'X-Request-ID': string
  }
}

export type _ = [Expect<Equal<Given, Expected>>]
