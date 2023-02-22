import {Endpoint} from "../EndpointRegister";
import {routeByUID} from "../../database/model/route/RouteManager";
import {getRouteLikes} from "../../database/model/user/UserManager";


export const getRouteEndpoint = {
    method: "GET",
    path: "v1/route",
    onCall: async (args, req, res) => {
        if (args.length < 1) {
            res.status(400).json({message: "MISSING_ROUTE_ID"});
            return;
        }

        const routeId = args[0];

        const databaseRoute = await routeByUID(routeId) as any;

        if (!databaseRoute) {
            res.status(404).json({message: "ROUTE_NOT_FOUND"});
            return;
        }

        databaseRoute.likes = await getRouteLikes(databaseRoute.uid)
        res.status(200).json(databaseRoute);
    }
} as Endpoint;