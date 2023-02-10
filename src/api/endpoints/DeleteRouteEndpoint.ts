import {Endpoint} from "../EndpointRegister";
import {removeRoute, routeByUID} from "../../database/model/route/RouteManager";
import {RequestPermission} from "../../Permissions";


export const deleteRouteEndpoint = {
    method: "DELETE",
    path: "v1/route",
    onCall: async (args, req, res) => {
        if (args.length < 1) {
            res.status(400).json({message: "MISSING_ROUTE_ID"});
            return;
        }

        const routeId: string = args[0];
        const route = await routeByUID(routeId);
        if (!route) {
            res.status(404).json({message: "ROUTE_NOT_FOUND"});
            return;
        }

        const user = req.username;
        const routeCreator = route.creator;

        if ((user !== routeCreator) && req.permission < RequestPermission.ADMIN) {
            res.status(403).json({message: "CANNOT_DELETE_OTHERS_ROUTE"});
            return;
        }

        await removeRoute(routeId);
    }

} as Endpoint;