import express, {Express} from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import {engine} from 'express-handlebars';
import {connectToDatabase} from "./src/database/GlobalDatabase";
import {isProduction, serverOptions} from "./src/ConfigurationProvider";
import {apiRouter} from "./src/routes/ApiRoute";
import {registerEndpoints} from "./src/api/EndpointRegister";
import helmet from 'helmet';
import fs from 'fs';
import https from "https";
import {accountRouter} from "./src/routes/AccountRoute";
import {userValidator} from "./src/auth/AutenticatorMiddleware";
import {serverStatusRouter} from "./src/routes/StatusRoute";
import {serverDevelopmentLogger, serverProductionLogger} from "./src/security/ServerLogger";
import {errorHandler} from "./src/error/ErrorHandler";

console.log("Starting server uwu")
startServer();

async function startServer() {
    const mainServer = express();

    // Modules initialization
    await setupDatabaseConnection();
    registerEndpoints();

    // Server configuration
    configureSSL(mainServer);
    setupLogger(mainServer);
    setupMiddleware(mainServer);
    setupCustomMiddleware(mainServer);
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

    function setupLogger(server: Express) {
        if (isProduction()) {
            server.use(serverProductionLogger);
        } else {
            server.use(serverDevelopmentLogger);
        }
    }

    function setupMiddleware(server: Express) {
        // view engine setup
        server.engine('handlebars', engine({defaultLayout: 'layout', partialsDir: path.join(__dirname, 'views/partials')}));
        server.set('view engine', 'handlebars');
        server.set('views', path.join(__dirname, 'views'));

        // body parser
        server.use(express.json());
        server.use(express.urlencoded({ extended: false }));

        // cookie parser
        server.use(cookieParser());

        // static files
        server.use(express.static(path.join(__dirname, 'public')));
    }

    function setupCustomMiddleware(server: Express) {
        server.use(userValidator);
    }

    function setupRoutes(server: Express) {
        server.use(serverStatusRouter);

        server.use(apiRouter);
        server.use(accountRouter);
    }

    function setupErrors(server: Express) {
        //forward to error handler
        server.use((req: any, res: any, next: any) => {
            next();
        });

        // error handler
        server.use(errorHandler);
    }

    function listenSecurely(server: Express, port: number, options: {key: Buffer, cert: Buffer, passphrase: string}) {
        https.createServer(options, server).listen(port);
        console.log('Server is listening on port', port);
    }
}