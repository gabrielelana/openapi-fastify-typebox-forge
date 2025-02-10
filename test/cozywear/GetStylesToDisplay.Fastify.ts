import * as ResponseBody200 from "./GetStylesToDisplay.200.ResponseBody";
import * as QueryString from "./GetStylesToDisplay.QueryString";
export type T = {
    querystring: QueryString.T;
    response: {
        200: ResponseBody200.T;
    };
};
export var T = { querystring: QueryString.T, response: { 200: ResponseBody200.T } };
