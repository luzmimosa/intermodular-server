import {RequestPermission} from "../Permissions";
import {verify} from "jsonwebtoken";

const highSecurityMinutes = 20;

export const userValidator = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

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
            if (decodedToken.iat + (1000 * 60 * highSecurityMinutes) < Date.now() ) {
                req.permission = RequestPermission.HIGH_SECURITY_USER;
            }

            next();
        } catch (e) {
            console.log("Request with invalid token");
            console.log(e);
            res.status(403).json({message: "INVALID_TOKEN"});
            return;
        }
    } else {
        req.permission = RequestPermission.PUBLIC;
        req.user = null;
        next();
    }
}