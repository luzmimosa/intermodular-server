import express from "express";
import {registerUser} from "../auth/UserRegistrator";
import {loginTokenByEmail, loginTokenByUsername} from "../auth/UserAutenticator";

export const accountRouter = express.Router();

accountRouter.post("/account", (req, res) => {
    res.status(200).json({ message: "Hello from account" });
})

accountRouter.post("/account/register", async (req, res) => {
    try {
        const username: string = req.body.username !!;
        const displayName: string = req.body.displayName ?? username;
        const biography: string = req.body.biography !!;
        const email: string = req.body.email !!;
        const password: string = req.body.password !!;

        registerUser(username, displayName, biography, email, password, (result, isError) => {
            console.log("Response: " + result);
            if (isError) {
                res.status(400).json({ message: result });
            } else {
                res.status(200).json({ message: result });
            }
        })

    } catch (error: any) {
        res.status(400).json({ message: "MISSING_PARAMS" });
    }
})

accountRouter.post("/account/login", async (req, res) => {

    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password !!;

        let token: string;

        if (username) {
            token = await loginTokenByUsername(username, password)
        } else if (email) {
            token = await loginTokenByEmail(email, password)
        } else {
            res.status(400).json({ message: "MISSING_PARAMS" });
            return;
        }

        res.status(200).setHeader("Authorization", token).json({ message: "OK" });

    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: "UNKNOWN_ERROR" });
    }
})

