import type * as AddNewClothMaterial from './cozywear/AddNewClothMaterial.Fastify'
import type * as GetMaterials from './cozywear/GetMaterials.Fastify'
import type * as RegisterUser from './cozywear/RegisterUser.Fastify'
import type * as UserLogin from './cozywear/UserLogin.Fastify'
import type { Equal, Expand, Expect } from './types'

type RegisterUser_Given = Expand<RegisterUser.T>
type RegisterUser_Expected = {
  body: {
    usertype: number
    email: string
    name: string
    password: string
  }
}

type UserLogin_Given = Expand<UserLogin.T>
type UserLogin_Expected = {
  body: {
    email: string
    password: string
  }
}

type AddNewClothMaterial_Given = Expand<AddNewClothMaterial.T>
type AddNewClothMaterial_Expected = {
  body: {
    image_file?: string | undefined
    data?:
      | {
          material_name?: string | undefined
          material_type?: string | undefined
          cost_per_unit?: number | undefined
          stock_quantity?: number | undefined
        }
      | undefined
  }
}

type GetMaterials_Given = Expand<GetMaterials.T>
type GetMaterials_Expected = {
  query: {
    page?: number | undefined
    per_page?: number | undefined
  }
  response: {
    200: {
      items?:
        | {
            id?: string | undefined
            sort_id?: number | undefined
            name?: string | undefined
            filename?: string | undefined
            costperunit?: number | undefined
            stockquantity?: number | undefined
          }[]
        | undefined
      total?: number | undefined
      page?: number | undefined
      per_page?: number | undefined
    }
  }
}

export type _ = [
  Expect<Equal<RegisterUser_Given, RegisterUser_Expected>>,
  Expect<Equal<UserLogin_Given, UserLogin_Expected>>,
  Expect<Equal<AddNewClothMaterial_Given, AddNewClothMaterial_Expected>>,
  Expect<Equal<GetMaterials_Given, GetMaterials_Expected>>,
]
