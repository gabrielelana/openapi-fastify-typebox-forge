import type * as EmptyResponse from './responseEmpty/EmptyResponseExample.Fastify'
import type { Equal, Expand, Expect } from './types'

type Given = Expand<EmptyResponse.T>

type Expected = {
  response: {
    200: unknown
    400: unknown
  }
}

export type _ = [Expect<Equal<Given, Expected>>]
