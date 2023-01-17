import express from "express";
import {registerUser} from "../auth/UserRegistrator";
import {credentialsMatch, userByUsername} from "../database/model/user/UserManager";
import {User} from "../database/model/user/UserModel";
import {sign} from "jsonwebtoken";

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
                res.status(400).json({ result: result });
            } else {
                res.status(200).json({ result: result });
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

        let match: boolean;
        let user: User | null;

        if (username) {
            match = await credentialsMatch.byUsername(username, password);
            user = await userByUsername(username);
        } else if (email) {
            match = await credentialsMatch.byEmail(email, password);
            user = await userByUsername(email);
        } else {
            res.status(400).json({ message: "MISSING_PARAMS" });
            return;
        }

        if (!match || !user) {
            res.status(400).json({ message: "INVALID_CREDENTIALS" });
            return;
        }

        const token = generateToken(user);

        res.status(200).setHeader("Authorization", token).json({ message: "OK" });

    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: "MISSING_PARAMS" });
    }
})

function generateToken(
    user: User,
    expiresIn: number = 60 * 60 * 24 * 7 // 7 days
): string {
    return sign(
        {
            username: user.username,
            creationTime: Date.now(),
        },
        process.env.JWT_SECRET !!,
        {
            expiresIn: expiresIn,
            algorithm: "HS256"
        }
    );
}