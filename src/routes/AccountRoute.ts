import express from "express";
import {registerUser} from "../auth/UserRegistrator";

export const accountRouter = express.Router();

accountRouter.post("/account", (req, res) => {
    res.status(200).json({ message: "Hello from account" });
})

accountRouter.post("/account/register", (req, res) => {
    try {
        const username = req.body.username;
        const displayName = req.body.displayName;
        const biography = req.body.biography;
        const email = req.body.email;
        const password = req.body.password;

        registerUser(username, displayName, biography, email, password, (result, isError) => {
            console.log("Response: " + result);
            if (isError) {
                res.status(400).json({ result: result });
            } else {
                res.status(200).json({ result: result });
            }
        })

    } catch (error: any) {
        res.status(400).json({ message: "MISSING_PARAMS" });
    }
})

accountRouter.post("/account/login", (req, res) => {
    res.status(200).json({ message: "Hello from account login" });
})