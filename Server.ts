import express, {Express} from 'express';
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
import createHttpError from "http-errors";
import {accountRouter} from "./src/routes/AccountRoute";

console.log("Starting server")
startServer();

async function startServer() {
    const mainServer = express();

    // Modules initialization
    await setupDatabaseConnection();
    registerEndpoints();

    // Server configuration
    configureSSL(mainServer);
    setupMiddleware(mainServer);
    setupRoutes(mainServer);
    setupErrors(mainServer);

    // Start server
    listenSecurely(
        mainServer,
        serverOptions.listeningPort,
        {
            key: fs.readFileSync(serverOptions.sslKeyPath),
            cert: fs.readFileSync(serverOptions.sslCertPath),
            passphrase: serverOptions.sslPassphrase
        }
    )


    async function setupDatabaseConnection() {

        let databaseConnected = true;
        await connectToDatabase((error) => {
            console.error(error);
            databaseConnected = false;
        })

        if (!databaseConnected) throw new Error("Database connection failed");
    }

    function configureSSL(server: Express) {
        server.use(helmet.hsts({
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }));
    }

    function setupMiddleware(server: Express) {
        // view engine setup
        server.set('views', path.join(__dirname, 'views'));
        server.set('view engine', 'pug');

        // logger
        server.use(logger('dev'));

        // body parser
        server.use(express.json());
        server.use(express.urlencoded({ extended: false }));

        // cookie parser
        server.use(cookieParser());

        // static files
        server.use(express.static(path.join(__dirname, 'public')));
    }

    function setupRoutes(server: Express) {
        server.use(apiRouter);
        server.use(accountRouter);
    }

    function setupErrors(server: Express) {
        //forward to error handler
        server.use((req: any, res: any, next: any) => {
            next(createHttpError(404));
        });

        // error handler
        server.use((err: any, req: any, res: any) => {
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    function listenSecurely(server: Express, port: number, options: {key: Buffer, cert: Buffer, passphrase: string}) {
        https.createServer(options, server).listen(port);
        console.log('Server is listening on port', port);
    }
}