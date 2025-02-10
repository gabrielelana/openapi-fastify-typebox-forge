import * as ResponseBody200 from "./RemoveStyle.200.ResponseBody";
import * as ResponseBody404 from "./RemoveStyle.404.ResponseBody";
import * as Path from "./RemoveStyle.Path";
export type T = {
    params: Path.T;
    response: {
        200: ResponseBody200.T;
        404: ResponseBody404.T;
    };
};
export var T = { params: Path.T, response: { 200: ResponseBody200.T, 404: ResponseBody404.T } };
