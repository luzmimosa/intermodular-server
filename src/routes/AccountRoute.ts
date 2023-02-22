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

        await registerUser(username, displayName, biography, email, password, (result, isError) => {
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

    // Try to log in with old token
    if (req.isLogged) {

        try {
            sendToken(res, await renewToken(req.token));
            return;
        } catch (e) {
            res.status(403).json({ message: "INVALID_TOKEN" });
        }
    } else {

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
                res.status(400).json({message: "MISSING_PARAMS"});
                return;
            }

            sendToken(res, token);

        } catch (error: any) {
            res.status(400).json({message: "INVALID_CREDENTIALS"});
        }
    }
})

accountRouter.post("/account/modify/:userid", async (req: any, res) => {

    // User is logged in
    if (!req.isLogged) {
        res.status(403).json({ message: "NOT_LOGGED_IN" });
        return;
    }

    let user: string;

    if (req.permission >= RequestPermission.ADMIN) {
        const userid: string | undefined = req.params.userid;
        if (!userid) {
            res.status(400).json({ message: "MISSING_USER" });
            return;
        }

        user = userid;

    } else {
        user = req.user;
    }



    // Not critical information (displayName, biography, profilePicture)
    const displayName       = req.body.displayName ?? undefined;
    const biography         = req.body.biography ?? undefined;
    const profilePicture    = req.body.profilePicture ?? undefined;

    if (displayName) {
        try {
            await modifyUserData(user, "displayName", displayName)
        } catch (e) {
            res.status(400).json({ message: "INVALID_DISPLAY_NAME" });
            return;
        }
    }
    if (biography) {
        try {
            await modifyUserData(user, "biography", biography)
        } catch (e) {
            res.status(400).json({ message: "INVALID_BIOGRAPHY" });
            return;
        }
    }
    if (profilePicture) {
        try {
            await modifyUserData(user, "profilePicture", profilePicture)
        } catch (e) {
            res.status(400).json({ message: "INVALID_PROFILE_PICTURE" });
            return;
        }
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
            try {
                await modifyUserData(user, "username", username)
            } catch (e) {
                res.status(400).json({ message: "INVALID_USERNAME" });
                return;
            }
        }
        if (email) {
            try {
                await modifyUserData(user, "email", email)
            } catch (e) {
                res.status(400).json({ message: "INVALID_EMAIL" });
                return;
            }
        }
        if (password) {
            try {
                await modifyUserData(user, "password", password)
            } catch (e) {
                res.status(400).json({ message: "INVALID_PASSWORD" });
                return;
            }
        }
    }

    res.status(200).json({ message: "OK" });

})

function sendToken(res: any, token: string) {
    res.setHeader("Authorization", token).status(200).json({ message: "OK" });
}