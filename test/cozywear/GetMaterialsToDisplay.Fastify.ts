import * as ResponseBody200 from "./GetMaterialsToDisplay.200.ResponseBody";
import * as QueryString from "./GetMaterialsToDisplay.QueryString";
export type T = {
    querystring: QueryString.T;
    response: {
        200: ResponseBody200.T;
    };
};
export var T = { querystring: QueryString.T, response: { 200: ResponseBody200.T } };
