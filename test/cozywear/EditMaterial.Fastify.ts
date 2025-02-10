import * as ResponseBody200 from "./EditMaterial.200.ResponseBody";
import * as ResponseBody400 from "./EditMaterial.400.ResponseBody";
import * as RequestBody from "./EditMaterial.RequestBody";
export type T = {
    body: RequestBody.T;
    response: {
        200: ResponseBody200.T;
        400: ResponseBody400.T;
    };
};
export var T = { body: RequestBody.T, response: { 200: ResponseBody200.T, 400: ResponseBody400.T } };
