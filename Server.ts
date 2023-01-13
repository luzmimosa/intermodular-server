import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {connectToDatabase} from "./src/database/GlobalDatabase";
import {createUser} from "./src/database/model/user/UserManager";


// routes constants

export const SERVER = express();

// view engine setup
SERVER.set('views', path.join(__dirname, 'views'));
SERVER.set('view engine', 'pug');

SERVER.use(logger('dev'));
SERVER.use(express.json());
SERVER.use(express.urlencoded({ extended: false }));
SERVER.use(cookieParser());
SERVER.use(express.static(path.join(__dirname, 'public')));


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

SERVER.listen(3000, () => {
    console.log('Server is running on port 3000');
});

connectToDatabase(() => {
    createUser({
        username: "pauetekkuet",
        displayName: "Pau ~ 💛",
        profilePicture: "default_profile_picture.png",
        biography: "Hey there, I'm using aplicación intermodular sin nombre",
        creationDatetime: Date.now(),
        featuredRoutes: [],
        toDoRoutes: [],
        email: "uwu@gmail.com",
        passwordHash: "edf9cf90718610ee7de53c0dcc250739239044de9ba115bb0ca6026c3e4958a5",
        devices: []
    }, () => {
        console.log('User created');
    }, (error) => {
        console.error(error);
    })
});