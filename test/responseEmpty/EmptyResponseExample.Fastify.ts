import * as ResponseBody200 from "./EmptyResponseExample.200.ResponseBody";
import * as ResponseBody400 from "./EmptyResponseExample.400.ResponseBody";
export type T = {
    response: {
        200: ResponseBody200.T;
        400: ResponseBody400.T;
    };
};
export var T = { response: { 200: ResponseBody200.T, 400: ResponseBody400.T } };
