import { Schema } from 'mongoose';
import * as mongoose from "mongoose";

export interface User {
    username: string,
    displayName: string,
    profilePicture: string,
    biography: string,
    featuredRoutes: Array<string>,
    toDoRoutes: Array<string>,
}

export interface PrivateUser extends User {
    email: string;
    passwordHash: string;
    creationDatetime: number;
    devices: Array<string>;

}

const userSchema = new Schema({
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    profilePicture: { type: String, required: true },
    biography: { type: String, required: true },
    featuredRoutes: { type: Array, required: true },
    toDoRoutes: { type: Array, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    creationDatetime: { type: Number, required: true },
    devices: { type: Array, required: true }
});

export const UserModel = mongoose.model('user', userSchema);
