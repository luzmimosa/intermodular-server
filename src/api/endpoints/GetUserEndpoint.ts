import {Endpoint} from "../EndpointRegister";
import {userByUsername} from "../../database/model/user/UserManager";


export const getUserEndpoint = {
    method: "GET",
    path: "v1/user",
    onCall: async (args, req, res) => {

        let username: string
        if (args.length < 1) {
            username = req.username
        } else {
            username = args[0]
        }

        const databaseUser = await userByUsername(username);
        if (!databaseUser) {
            res.status(404).json({message: "USER_NOT_FOUND"});
            return;
        }

        res.status(200).json(databaseUser);
    }
} as Endpoint;