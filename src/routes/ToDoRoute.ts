import express from "express";
import {removeToDoRoute, addToDoRoute} from "../database/model/user/UserManager";


export const toDoRouter = express.Router();

toDoRouter.put("/todo/:route", async (req: any, res) => {
    if (!req.isLogged) {
        res.status(403).json({message: "NOT_LOGGED_IN"});
        return;
    }

    try {
        const routeId = req.params.route as string;
        await addToDoRoute(req.username, routeId)
        res.status(200).json({message: "OK"});
    } catch (error) {
        res.status(400).json({message: "MISSING_PARAMS"});
    }
})

toDoRouter.delete("/todo/:route", async (req: any, res) => {
    if (!req.isLogged) {
        res.status(403).json({message: "NOT_LOGGED_IN"});
        return;
    }

    try {
        const routeId = req.params.route as string;
        await removeToDoRoute(req.username, routeId)
        res.status(200).json({message: "OK"});
    } catch (error) {
        res.status(400).json({message: "MISSING_PARAMS"});
    }
});