import {RequestPermission} from "../Permissions";
import {verify} from "jsonwebtoken";
import {isAdmin} from "../database/model/user/UserManager";

const highSecurityMinutes = 20;

export const userValidator = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length >= 2) {

            const token = tokenParts[1];

            try {

                const decodedToken: any = verify(token, process.env.JWT_SECRET !!)

                req.permission = RequestPermission.USER;
                req.username = decodedToken.username
                req.isLogged = true;
                req.token = decodedToken

                // Check if the token is expired
                if (decodedToken.exp < Date.now() / 1000) {
                    res.status(401).send("TOKEN_EXPIRED");
                    return;
                }

                // Check if the token is high security (recently created)
                if (decodedToken.iat + (1000 * 60 * highSecurityMinutes) < Date.now()) {
                    req.permission = RequestPermission.HIGH_SECURITY_USER;
                }

                // Check if the user is admin
                if (await isAdmin(req.username)) {
                    req.permission = RequestPermission.ADMIN;
                }

                next();
                return;
            } catch (e) {
                res.status(403).json({message: "INVALID_TOKEN"});
                return;
            }
        }
    }

    req.permission = RequestPermission.PUBLIC;
    req.user = null;
    next();
}