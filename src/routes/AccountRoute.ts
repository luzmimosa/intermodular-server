import express from "express";
import {registerUser} from "../auth/UserRegistrator";
import {loginTokenByEmail, loginTokenByUsername, renewToken} from "../auth/UserAutenticator";
import {modifyUserData} from "../database/model/user/UserManager";
import {RequestPermission} from "../Permissions";


export const accountRouter = express.Router();

accountRouter.post("/account", (req, res) => {
    res.status(200).json({ message: "Hello from account" });
    // TODO
})

accountRouter.post("/account/register", async (req, res) => {
    try {
        const username: string = req.body.username !!;
        const displayName: string = req.body.displayName ?? username;
        const biography: string = req.body.biography ?? " ";
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

accountRouter.post("/account/login", async (req: any, res) => {

    // Try to login with old token
    if (req.isLogged) {

        try {
            sendToken(res, await renewToken(req.token));
        } catch (e) {
            res.status(403).json({ message: "INVALID_TOKEN" });
        }
    }

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

        sendToken(res, token);

    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: "UNKNOWN_ERROR" });
    }
})

accountRouter.post("/account/modify", async (req: any, res) => {

    // User is logged in
    if (!req.isLogged) {
        res.status(403).json({ message: "NOT_LOGGED_IN" });
        return;
    }

    const user = req.username;

    // Not critical information (displayName, biography, profilePicture)
    const displayName       = req.body.displayName ?? undefined;
    const biography         = req.body.biography ?? undefined;
    const profilePicture    = req.body.profilePicture ?? undefined;

    if (displayName) {
        await modifyUserData(user, "displayName", displayName)
    }
    if (biography) {
        await modifyUserData(user, "biography", biography)
    }
    if (profilePicture) {
        await modifyUserData(user, "profilePicture", profilePicture)
    }

    // Critical information (username, email, password)
    const username = req.body.username ?? undefined;
    const email = req.body.email ?? undefined;
    const password = req.body.password ?? undefined;

    if (username || email || password) {
        if (req.permission < RequestPermission.HIGH_SECURITY_USER) {
            res.status(403).json({ message: "NOT_HIGH_SECURITY" });
            return;
        }

        if (username) {
            await modifyUserData(user, "username", username)
        }
        if (email) {
            await modifyUserData(user, "email", email)
        }
        if (password) {
            await modifyUserData(user, "password", password)
        }
    }

    res.status(200).json({ message: "OK" });

})

function sendToken(res: any, token: string) {
    res.status(200).setHeader("Authorization", token).json({ message: "OK" });
}