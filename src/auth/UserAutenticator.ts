import {credentialsMatch, userByEmail, userByUsername} from "../database/model/user/UserManager";
import {User} from "../database/model/user/UserModel";
import {decode, sign} from "jsonwebtoken";


export async function loginTokenByUsername(username: string, password: string): Promise<string> {
    const match = await credentialsMatch.byUsername(username, password);

    if (!match) {
        throw new Error("INVALID_CREDENTIALS")
    }

    return generateToken((await userByUsername(username)) !!);
}

export async function loginTokenByEmail(email: string, password: string): Promise<string> {
    const match = await credentialsMatch.byEmail(email, password);

    if (!match) {
        throw new Error("INVALID_CREDENTIALS")
    }

    return generateToken((await userByEmail(email)) !!)
}

export async function renewToken(token: any): Promise<string> {

    console.log("Token:", token)

    if (token.exp < Date.now() / 1000) {
        console.log("Token expires at: ", token.exp);
        console.log("Current time: ", Date.now());

        console.log("Token expired ("+ (token.exp < Date.now()) +")");
        throw new Error("TOKEN_EXPIRED");
    }

    return generateToken((await userByUsername(token.username)) !!);
}

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