import {PrivateUser, UserModel} from "./UserModel";
import * as mongoose from "mongoose";



export async function createUser(
    user: PrivateUser,
    onSuccess: () => void = () => {},
    onError: (error: string) => void = () => {}
) {
    console.log("Creating user");

    try {
        if (!(await usernameAvaiable(user.username))) {
            onError("Username already taken");
            return;
        }

        if (!(await emailAvaiable(user.email))) {
            onError("Email already taken");
            return;
        }

        const newUser = new UserModel(user);
        await newUser.save();

        console.log("User created: ", newUser.username);
        onSuccess();

    } catch (err: any) {
        console.error(err);
        onError("Unknown error");
    }
}

export async function getUsersBy(query: mongoose.FilterQuery<PrivateUser>): Promise<PrivateUser[]> {
    try {
        return await UserModel.find(query).exec();
    } catch (error: any) {
        throw new Error(error);
    }
}

export async function getAllUsers(): Promise<PrivateUser[]> {
    return await getUsersBy({});
}

export async function usernameAvaiable(username: string): Promise<boolean> {
    const users = await getUsersBy({username: username});
    return users.length === 0;
}

export async function emailAvaiable(email: string): Promise<boolean> {
    const users = await getUsersBy({email: email});
    return users.length === 0;
}