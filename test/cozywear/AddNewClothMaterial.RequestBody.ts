/**
 * ATTENTION. This code was AUTO GENERATED by schema2typebox.
 * While I don't know your use case, there is a high chance that direct changes
 * to this file get lost. Consider making changes to the underlying JSON schema
 * you use to generate this file instead. The default file is called
 * "schema.json", perhaps have a look there! :]
 */

import {
    Static,
    Type
} from "@sinclair/typebox";

export type T = Static<typeof T>;
export const T = Type.Object(
  {
    image_file: Type.Optional(Type.String({ format: "binary" })),
    data: Type.Optional(
      Type.Object({
        material_name: Type.Optional(Type.String()),
        material_type: Type.Optional(Type.String({ format: "uuid" })),
        cost_per_unit: Type.Optional(Type.Number()),
        stock_quantity: Type.Optional(Type.Number()),
      })
    ),
  },
  { $id: "T" }
);
