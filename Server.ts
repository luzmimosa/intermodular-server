import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {connectToDatabase} from "./src/database/GlobalDatabase";
import {serverOptions} from "./src/ConfigurationProvider";
import {apiRouter} from "./src/routes/ApiRoute";
import {registerEndpoints} from "./src/api/EndpointRegister";
import {createUser} from "./src/database/model/user/UserManager";

export const SERVER = express();

startupSequence().then(() => console.log("Startup sequence finished"));

// Functions

async function startupSequence() {
    // database
    if (!(await setupDatabase())) return;

    //server
    setupServer();
    setupEndpoints();

    createUser({
        username: "alpaca",
        passwordHash: "edf9cf90718610ee7de53c0dcc250739239044de9ba115bb0ca6026c3e4958a5",
        email: "alpaca@gmail.com",
        profilePicture: "default_profile_picture.png",
        displayName: "Alpaca ~ 💕",
        biography: "I am an alpaca",
        creationDatetime: Date.now(),
        devices: [],
        featuredRoutes: [],
        toDoRoutes: [],
    })

}

function setupEndpoints() {
    registerEndpoints();
}

async function setupRoutes() {
    SERVER.use(apiRouter);
}

async function setupDatabase() {
    let databaseConnected = true;
    await connectToDatabase((error) => {
        console.error(error);
        databaseConnected = false;
    })

    return databaseConnected;
}

function setupServer() {
    // view engine setup
    SERVER.set('views', path.join(__dirname, 'views'));
    SERVER.set('view engine', 'pug');

    SERVER.use(logger('dev'));
    SERVER.use(express.json());
    SERVER.use(express.urlencoded({ extended: false }));
    SERVER.use(cookieParser());
    SERVER.use(express.static(path.join(__dirname, 'public')));

    setupRoutes();

    //forward to error handler
    SERVER.use((req: any, res: any, next: any) => {
        next(createError(404));
    });

    // error handler
    SERVER.use((err: any, req: any, res: any) => {
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    const port = serverOptions.listeningPort;

    SERVER.listen(port, () => {
        console.log('Server is running on port', port);
    });
}