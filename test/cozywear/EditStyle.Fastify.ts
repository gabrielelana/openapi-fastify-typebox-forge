import * as ResponseBody200 from "./EditStyle.200.ResponseBody";
import * as ResponseBody400 from "./EditStyle.400.ResponseBody";
import * as RequestBody from "./EditStyle.RequestBody";
export type T = {
    body: RequestBody.T;
    response: {
        200: ResponseBody200.T;
        400: ResponseBody400.T;
    };
};
export var T = { body: RequestBody.T, response: { 200: ResponseBody200.T, 400: ResponseBody400.T } };
