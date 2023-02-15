import {Endpoint} from "../EndpointRegister";
import {commentRoute} from "../../database/model/route/RouteManager";


export const postCommentEndpoint = {
    path: "v1/comment",
    method: "POST",
    onCall: async (args, req, res) => {
        if (!req.isLogged){
            res.status(401).json({message: "UNAUTHORIZED"});
            return;
        }

        if (args.length !== 1){
            res.status(400).json({message: "INVALID_ARGUMENTS"});
            return;
        }

        const routeUID = args[0];
        const username = req.username;
        const comment = req.body.comment;
        const date = Date.now();

        if (!routeUID || !username || !comment || !date) {
            res.status(400).json({message: "INVALID_COMMENT"});
            return;
        }

        try {
            await commentRoute(routeUID, {
                username: req.username,
                comment: comment,
                date: date
            })
            res.status(200).json({message: "OK"});
        } catch (e) {
            res.status(404).json({message: "ROUTE_NOT_FOUND"});
            return;
        }

    }
} as Endpoint
