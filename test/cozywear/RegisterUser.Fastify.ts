import * as ResponseBody201 from "./RegisterUser.201.ResponseBody";
import * as ResponseBody400 from "./RegisterUser.400.ResponseBody";
import * as RequestBody from "./RegisterUser.RequestBody";
export type T = {
    body: RequestBody.T;
    response: {
        201: ResponseBody201.T;
        400: ResponseBody400.T;
    };
};
export var T = { body: RequestBody.T, response: { 201: ResponseBody201.T, 400: ResponseBody400.T } };
