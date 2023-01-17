import {Endpoint} from "../EndpointRegister";
import {userByUsername} from "../../database/model/user/UserManager";


export const getUserEndpoint = {
    method: "GET",
    path: "v1/user",
    onCall: async (args, req, res) => {
        if (args.length < 1) {
            res.status(400).json({message: "MISSING_USERNAME"});
            return;
        }

        const username = args[0];

        const databaseUser = await userByUsername(username);
        if (!databaseUser) {
            res.status(404).json({message: "USER_NOT_FOUND"});
            return;
        }

        res.status(200).json(databaseUser);
    }
} as Endpoint;