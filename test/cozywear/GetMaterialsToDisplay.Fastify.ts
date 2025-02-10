import * as ResponseBody200 from "./GetMaterialsToDisplay.200.ResponseBody";
import * as QueryString from "./GetMaterialsToDisplay.QueryString";
export type T = {
    query: QueryString.T;
    response: {
        200: ResponseBody200.T;
    };
};
export var T = { query: QueryString.T, response: { 200: ResponseBody200.T } };
