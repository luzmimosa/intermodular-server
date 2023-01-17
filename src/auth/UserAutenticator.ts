import {credentialsMatch, userByEmail, userByUsername} from "../database/model/user/UserManager";
import {User} from "../database/model/user/UserModel";
import {sign} from "jsonwebtoken";


export async function loginTokenByUsername(username: string, password: string): Promise<string> {
    const match = await credentialsMatch.byUsername(username, password);

    if (!match) {
        throw new Error("INVALID_CREDENTIALS")
    }

    return generateToken((await userByUsername(username)) !!);
}

export async function loginTokenByEmail(email: string, password: string): Promise<string> {
    const user = await userByEmail(email);

    if (user) return loginTokenByUsername(user.username, password);
    else throw new Error("INVALID_CREDENTIALS");
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