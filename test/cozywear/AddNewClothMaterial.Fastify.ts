import * as ResponseBody201 from "./AddNewClothMaterial.201.ResponseBody";
import * as ResponseBody400 from "./AddNewClothMaterial.400.ResponseBody";
import * as RequestBody from "./AddNewClothMaterial.RequestBody";
export type T = {
    body: RequestBody.T;
    response: {
        201: ResponseBody201.T;
        400: ResponseBody400.T;
    };
};
export var T = { body: RequestBody.T, response: { 201: ResponseBody201.T, 400: ResponseBody400.T } };
