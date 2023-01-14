import {Endpoint} from "../EndpointRegister";


export const getUserEndpoint = {
    method: "GET",
    path: "v1/user",
    onCall: (args, req, res) => {
        let response = "HI!";
        for (let argument of args) {
            response += "(" + argument + ")";
        }
        res.send(response);
    }
} as Endpoint;