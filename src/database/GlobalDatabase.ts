import {connect} from 'mongoose';
import {databaseInfo} from "../ConfigurationProvider";

export async function connectToDatabase(
    onConnect: () => void = () => {},
    onError: (error: string) => void = () => {}
) {
    console.log("Connecting to database");

    await connect(`mongodb://${databaseInfo.host}:${databaseInfo.port}/${databaseInfo.database}`)
        .then(() => {
            console.log("Connected to database");
            onConnect();
        }, (err: any) => {
            console.log("Error connecting to database");
            onError(err);
        });
}