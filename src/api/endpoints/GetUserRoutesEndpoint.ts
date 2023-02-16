import {Endpoint} from "../EndpointRegister";
import {routesByCreator} from "../../database/model/route/RouteManager";


export const getUserRoutesEndpoint = {
    method: "GET",
    path: "/v1/userroutes",
    onCall: async (args, req, res) => {
        if (args.length == 0) {
            res.status(400).json({message: "NO_USER_SPECIFIED"});
            return;
        }

        const username = args[0];

        const routes = await routesByCreator(username);

        res.status(200).json(routes.map(route => route.uid));
    }
} as Endpoint