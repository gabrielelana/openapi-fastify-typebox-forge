import * as ResponseBody201 from "./PlaceOrder.201.ResponseBody";
import * as RequestBody from "./PlaceOrder.RequestBody";
export type T = {
    body: RequestBody.T;
    response: {
        201: ResponseBody201.T;
    };
};
export var T = { body: RequestBody.T, response: { 201: ResponseBody201.T } };
