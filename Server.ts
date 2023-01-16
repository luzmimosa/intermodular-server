import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {connectToDatabase} from "./src/database/GlobalDatabase";
import {serverOptions} from "./src/ConfigurationProvider";
import {apiRouter} from "./src/routes/ApiRoute";
import {registerEndpoints} from "./src/api/EndpointRegister";
import helmet from 'helmet';
import fs from 'fs';
import https from "https";

export const SERVER = express();

startupSequence().then(() => console.log("Startup sequence finished"));

// Functions

async function startupSequence() {
    // database
    if (!(await setupDatabase())) return;

    //server
    setupServer();
    setupEndpoints();

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

    let serverStartupOptions = {};

    // SSL use
    if (serverOptions.useSSL) {

        SERVER.use((req, res, next) => {
            if (req.secure) {
                // request is already secure, proceed
                next();
            } else {
                // request is not secure, redirect to https
                res.redirect('https://' + req.headers.host + req.url);
            }
        });


        SERVER.use(helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }))

        serverStartupOptions = {
            key: fs.readFileSync('./ssl/private.pem'),
            cert: fs.readFileSync('./ssl/certificate.pem'),
            passphrase: 'redstone'
        }

    }

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
    SERVER.use((req: any, res: any) => {
        res.status(404).send("404 - Not found");
    });

    // error handler
    SERVER.use((err: any, req: any, res: any) => {
        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

    const port = serverOptions.listeningPort;
    https.createServer(serverStartupOptions, SERVER).listen(port);

    console.log('Server is running on port', port);
}