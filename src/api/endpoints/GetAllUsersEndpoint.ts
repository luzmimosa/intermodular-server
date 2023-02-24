import {Endpoint} from "../EndpointRegister";
import {getAllUsernames} from "../../database/model/user/UserManager";


export const getAllUsersEndpoint = {
    method: "GET",
    path: "v1/allusers",
    onCall: async (args, req, res) => {

        try {
            const usernames = await getAllUsernames();
            res.status(200).json(usernames);
        } catch (e) {
            res.status(500).json({message: "UNKNOWN_ERROR"});
        }

    }
} as Endpoint;