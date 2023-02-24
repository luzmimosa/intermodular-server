import {Endpoint} from "../EndpointRegister";
import {deleteUser} from "../../database/model/user/UserManager";


export const deleteUserEndpoint = {
    method: "DELETE",
    path: "v1/user",
    onCall: async (args, req, res) => {
        if (args.length < 1) {
            res.status(400).json({message: "MISSING_USERNAME"});
            return;
        }

        const username = args[0];
        try {
            const userDeleted = await deleteUser(username)

            if (userDeleted) {
                res.status(200).json({message: "USER_DELETED"});
                return;
            } else {
                res.status(404).json({message: "USER_NOT_FOUND"});
                return;
            }
        } catch (e) {}

        res.status(500).json({message: "UNKNOWN_ERROR"});

    }
} as Endpoint