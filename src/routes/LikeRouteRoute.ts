import express from "express";
import {dislikeRoute, likeRoute} from "../database/model/user/UserManager";


export const likeRouter = express.Router();

likeRouter.put("/like/:route", async (req: any, res) => {
    if (!req.isLogged) {
        res.status(403).json({message: "NOT_LOGGED_IN"});
        return;
    }

    try {
        const routeId = req.params.route as string;
        await likeRoute(req.username, routeId)
        res.status(200).json({message: "OK"});
    } catch (error) {
        res.status(400).json({message: "MISSING_PARAMS"});
    }
})

likeRouter.delete("/like/:route", async (req: any, res) => {
    if (!req.isLogged) {
        res.status(403).json({message: "NOT_LOGGED_IN"});
        return;
    }

    try {
        const routeId = req.params.route as string;
        await dislikeRoute(req.username, routeId)
        res.status(200).json({message: "OK"});
    } catch (error) {
        res.status(400).json({message: "MISSING_PARAMS"});
    }
});