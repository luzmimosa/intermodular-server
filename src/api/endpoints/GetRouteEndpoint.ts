import {Endpoint} from "../EndpointRegister";
import {routeByUID} from "../../database/model/route/RouteManager";


export const getRouteEndpoint = {
    method: "GET",
    path: "v1/route",
    onCall: async (args, req, res) => {
        if (args.length < 1) {
            res.status(400).json({message: "MISSING_ROUTE_ID"});
            return;
        }

        const routeId = args[0];

        const databaseRoute = await routeByUID(routeId);

        if (!databaseRoute) {
            res.status(404).json({message: "ROUTE_NOT_FOUND"});
            return;
        }

        res.status(200).json(databaseRoute);
    }
} as Endpoint;