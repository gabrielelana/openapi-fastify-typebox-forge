import type * as AddNewClothMaterial from './cozywear/AddNewClothMaterial.Fastify'
import type * as AddNewClothStyle from './cozywear/AddNewClothStye.Fastify'
import type * as EditMaterial from './cozywear/EditMaterial.Fastify'
import type * as EditStyle from './cozywear/EditStyle.Fastify'
import type * as GetFitTypes from './cozywear/GetFitTypes.Fastify'
import type * as GetMaterialTypes from './cozywear/GetMaterialTypes.Fastify'
import type * as GetMaterials from './cozywear/GetMaterials.Fastify'
import type * as GetMaterialsToDisplay from './cozywear/GetMaterialsToDisplay.Fastify'
import type * as GetStyleTypes from './cozywear/GetStyleTypes.Fastify'
import type * as GetStyles from './cozywear/GetStyles.Fastify'
import type * as GetStylesToDisplay from './cozywear/GetStylesToDisplay.Fastify'
import type * as GetUserNotifications from './cozywear/GetUserNotifications.Fastify'
import type * as PlaceOrder from './cozywear/PlaceOrder.Fastify'
import type * as RegisterUser from './cozywear/RegisterUser.Fastify'
import type * as RemoveMaterial from './cozywear/RemoveMaterial.Fastify'
import type * as RemoveStyle from './cozywear/RemoveStyle.Fastify'
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

type RemoveMaterial_Given = Expand<RemoveMaterial.T>
type RemoveMaterial_Expected = {
  params: {
    id: string
  }
}

type GetMaterialTypes_Given = Expand<GetMaterialTypes.T>
type GetMaterialTypes_Expected = {
  response: {
    200: { type_id?: string | undefined; name?: string | undefined }[]
  }
}

type EditMaterial_Given = Expand<EditMaterial.T>
type EditMaterial_Expected = {
  body: {
    id?: string | undefined
    name?: string | undefined
    cost_per_unit?: number | undefined
    stock_quantity?: number | undefined
    material_type_id?: string | undefined
  }
}

type AddNewClothStyle_Given = Expand<AddNewClothStyle.T>
type AddNewClothStyle_Expected = {
  body: {
    image_file?: string | undefined
    data?:
      | {
          style_name?: string | undefined
          description?: string | undefined
          style_type?: string | undefined
          material_type_required?: string | undefined
          fit_type?: string | undefined
          cost_per_unit?: number | undefined
        }
      | undefined
  }
  // TODO: probably should type the responses as unknown?
  // response: {
  // 201: unknown
  // 400: unknown
  // }
}

type GetStyles_Given = Expand<GetStyles.T>
type GetStyles_Expected = {
  query: {
    page?: number | undefined
    per_page?: number | undefined
  }
  response: {
    200: {
      items?:
        | {
            costperunit?: number | undefined
            id?: string | undefined
            sort_id?: number | undefined
            filename?: string | undefined
            material_type_id?: string | undefined
            fit_id?: string | undefined
            name?: string | undefined
            description?: string | undefined
          }[]
        | undefined
      total?: number | undefined
      page?: number | undefined
      per_page?: number | undefined
    }
  }
}

type RemoveStyle_Given = Expand<RemoveStyle.T>
type RemoveStyle_Expected = {
  params: {
    id: string
  }
  // TODO: should have the responses as unknown?
}

type GetFitTypes_Given = Expand<GetFitTypes.T>
type GetFitTypes_Expected = {
  response: {
    200: {
      fit_id?: string | undefined
      name?: string | undefined
    }[]
  }
}

type GetStyleTypes_Given = Expand<GetStyleTypes.T>
type GetStyleTypes_Expected = {
  response: {
    200: {
      style_id?: string | undefined
      base_style_type?: string | undefined
      name?: string | undefined
    }[]
  }
}

type EditStyle_Given = Expand<EditStyle.T>
type EditStyle_Expected = {
  body: {
    id?: string | undefined
    name?: string | undefined
    description?: string | undefined
    cost_per_unit?: number | undefined
    style_type_id?: string | undefined
    fit_type_id?: string | undefined
  }
}

type PlaceOrder_Given = Expand<PlaceOrder.T>
type PlaceOrder_Expected = {
  body: {
    cloth_style_id?: string | undefined
    material_id?: string | undefined
    size?: string | undefined
    special_instructions?: string | undefined
    payment_amount?: number | undefined
  }
  response: {
    201: {
      order_id?: string | undefined
      customer_id?: string | undefined
      cloth_style_id?: string | undefined
      material_id?: string | undefined
      size?: string | undefined
      special_instructions?: string | undefined
      created_at?: string | undefined
    }
  }
}

type GetStylesToDisplay_Given = Expand<GetStylesToDisplay.T>
type GetStylesToDisplay_Expected = {
  query: {
    page?: number | undefined
    per_page?: number | undefined
  }
  response: {
    200: {
      items?:
        | {
            id?: string | undefined
            name?: string | undefined
            description?: string | undefined
            filename?: string | undefined
            cost_per_unit?: number | undefined
          }[]
        | undefined
      total?: number | undefined
      page?: number | undefined
      per_page?: number | undefined
    }
  }
}

type GetMaterialsToDisplay_Given = Expand<GetMaterialsToDisplay.T>
type GetMaterialsToDisplay_Expected = {
  query: {
    page?: number | undefined
    per_page?: number | undefined
  }
  response: {
    200: {
      items?:
        | {
            id?: string | undefined
            name?: string | undefined
            filename?: string | undefined
            cost_per_unit?: number | undefined
          }[]
        | undefined
      total?: number | undefined
      page?: number | undefined
      per_page?: number | undefined
    }
  }
}

type GetUserNotifications_Given = Expand<GetUserNotifications.T>
type GetUserNotifications_Expected = {
  query: {
    page?: number | undefined
    per_page?: number | undefined
  }
  response: {
    200: {
      items?:
        | {
            id?: number | undefined
            order_id?: string | undefined
            message?: string | undefined
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
  Expect<Equal<RemoveMaterial_Given, RemoveMaterial_Expected>>,
  Expect<Equal<GetMaterialTypes_Given, GetMaterialTypes_Expected>>,
  Expect<Equal<EditMaterial_Given, EditMaterial_Expected>>,
  Expect<Equal<AddNewClothStyle_Given, AddNewClothStyle_Expected>>,
  Expect<Equal<GetStyles_Given, GetStyles_Expected>>,
  Expect<Equal<RemoveStyle_Given, RemoveStyle_Expected>>,
  Expect<Equal<GetFitTypes_Given, GetFitTypes_Expected>>,
  Expect<Equal<GetStyleTypes_Given, GetStyleTypes_Expected>>,
  Expect<Equal<EditStyle_Given, EditStyle_Expected>>,
  Expect<Equal<PlaceOrder_Given, PlaceOrder_Expected>>,
  Expect<Equal<GetStylesToDisplay_Given, GetStylesToDisplay_Expected>>,
  Expect<Equal<GetMaterialsToDisplay_Given, GetMaterialsToDisplay_Expected>>,
  Expect<Equal<GetUserNotifications_Given, GetUserNotifications_Expected>>,
]
