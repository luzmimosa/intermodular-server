import {PrivateUser, User, UserModel} from "./UserModel";
import * as mongoose from "mongoose";
import {hash, compareSync} from "bcrypt";

async function getUsersBy(query: mongoose.FilterQuery<PrivateUser>): Promise<PrivateUser[]> {
    try {
        return await UserModel.find(query).exec();
    } catch (error: any) {
        throw new Error(error);
    }
}

async function getAllUsers(): Promise<PrivateUser[]> {
    return await getUsersBy({});
}


// Internal API Functions

export async function usernameAvaiable(username: string): Promise<boolean> {
    const users = await getUsersBy({username: username});
    return users.length === 0;
}

export async function emailAvaiable(email: string): Promise<boolean> {
    const users = await getUsersBy({email: email});
    return users.length === 0;
}

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

        user.passwordHash = await encryptPassword(user.passwordHash);

        const newUser = new UserModel(user);
        await newUser.save();

        console.log("User created: ", newUser.username);
        onSuccess();

    } catch (err: any) {
        console.error(err);
        onError("Unknown error");
    }
}


export async function userByUsername(username: string): Promise<User | null> {
    const user = await getUsersBy({username: username});
    if (user.length === 0) {
        return null;
    } else {
        return privateUserToUser(user[0]);
    }
}

export const credentialsMatch = {
    byUsername: async (username: string, password: string): Promise<boolean> => {
        const user = await getUsersBy({username: username})

        if (user.length === 0) {
            return false;
        }

        return compareSync(password, user[0].passwordHash);
    },

    byEmail: async (email: string, password: string): Promise<boolean> => {
        const user = await getUsersBy({email: email})

        if (user.length === 0) {
            return false;
        }

        return compareSync(password, user[0].passwordHash);
    }
}


function privateUserToUser(user: PrivateUser): User {
    return {
        username: user.username,
        profilePicture: user.profilePicture,
        displayName: user.displayName,
        toDoRoutes: user.toDoRoutes,
        featuredRoutes: user.featuredRoutes,
        biography: user.biography
    }
}

async function encryptPassword(password: string): Promise<string> {
    return await hash(password, 10);
}