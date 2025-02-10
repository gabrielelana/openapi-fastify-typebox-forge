import * as ResponseBody200 from "./RemoveMaterial.200.ResponseBody";
import * as ResponseBody404 from "./RemoveMaterial.404.ResponseBody";
import * as Path from "./RemoveMaterial.Path";
export type T = {
    params: Path.T;
    response: {
        200: ResponseBody200.T;
        404: ResponseBody404.T;
    };
};
export var T = { params: Path.T, response: { 200: ResponseBody200.T, 404: ResponseBody404.T } };
