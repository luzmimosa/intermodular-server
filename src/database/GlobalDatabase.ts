import {connect} from 'mongoose';
import {databaseOptions} from "../ConfigurationProvider";
import * as mongoose from "mongoose";

export async function connectToDatabase(
    onError: (error: string) => void = () => {}
) {
    console.log("Connecting to database");
    mongoose.set('strictQuery', true);

    await connect(
        `mongodb://${databaseOptions.host}:${databaseOptions.port}/${databaseOptions.database}`
    ).catch((error: any) => {
        onError(error);
    })

}