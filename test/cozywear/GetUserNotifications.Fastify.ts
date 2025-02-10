import * as ResponseBody200 from "./GetUserNotifications.200.ResponseBody";
import * as ResponseBody401 from "./GetUserNotifications.401.ResponseBody";
import * as QueryString from "./GetUserNotifications.QueryString";
export type T = {
    querystring: QueryString.T;
    response: {
        200: ResponseBody200.T;
        401: ResponseBody401.T;
    };
};
export var T = { querystring: QueryString.T, response: { 200: ResponseBody200.T, 401: ResponseBody401.T } };
