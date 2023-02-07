import {createUser, emailAvaiable, usernameAvaiable} from "../database/model/user/UserManager";

const usernameRegex = /^\w{3,}$/;
const displayNameRegex = /^.{3,}$/;
const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const bioRegex = /^.{0,120}$/;


export async function registerUser(
    username: string,
    displayName: string,
    biography: string,
    email: string,
    password: string,
    callback: (result: any, isError: boolean) => void = () => {}
) {

    // Validate properties
    if (!usernameRegex.test(username)) {
        callback("INVALID_USERNAME", true);
        return;
    }
    if (!displayNameRegex.test(displayName)) {
        callback("INVALID_DISPLAYNAME", true);
        return;
    }
    if (!bioRegex.test(biography)) {
        callback("INVALID_BIO", true);
        return;
    }
    if (!emailRegex.test(email)) {
        callback("INVALID_EMAIL", true);
        return;
    }
    if (
        await userExists(
            username,
            email,
            (error) => callback(error, true)
        )
    ) {
        return;
    }

    await createUser(
        {
            // Provided info
            username: username,
            displayName: displayName,
            biography: biography,
            email: email,
            passwordHash: password,

            // Default info
            devices: [],
            toDoRoutes: [],
            featuredRoutes: [],
            profilePicture: "default",
            creationDatetime: Date.now()
        },
        () => {
            callback("SUCCESS", false);
        },
        () => {
            callback("UNKNOWN_ERROR", true);
        }
    )
}

async function userExists(username: string, email: string, callback: (error: any) => void = () => {}) {
    if (!(await usernameAvaiable(username))) {
        callback("USERNAME_TAKEN");
        return true;
    }
    if (!(await emailAvaiable(email))) {
        callback("EMAIL_TAKEN");
        return true;
    }

    return false;
}