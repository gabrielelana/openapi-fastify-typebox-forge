import * as ResponseBody200 from "./UserLogin.200.ResponseBody";
import * as ResponseBody401 from "./UserLogin.401.ResponseBody";
import * as RequestBody from "./UserLogin.RequestBody";
export type T = {
    body: RequestBody.T;
    response: {
        200: ResponseBody200.T;
        401: ResponseBody401.T;
    };
};
export var T = { body: RequestBody.T, response: { 200: ResponseBody200.T, 401: ResponseBody401.T } };
