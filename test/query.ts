import type * as Query from './query/QueryStringExample.Fastify'
import type { Equal, Expand, Expect } from './types'

type Given = Expand<Query.T>

type Expected = {
  query: {
    offset: number
    limit?: number | undefined
  }
}

export type _ = [Expect<Equal<Given, Expected>>]
