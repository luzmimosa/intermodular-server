import {Endpoint} from "../EndpointRegister";
import {randomRoutes} from "../../database/model/route/RouteManager";


export const getRandomRoutesEndpoint = {
    method: "GET",
    path: "v1/randomroutes",
    onCall: async (args, req, res) => {
        const routes = await randomRoutes(10)
        res.status(200).json(routes.map(route => route.uid))
    }
} as Endpoint