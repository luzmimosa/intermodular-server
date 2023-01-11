import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';


// routes constants

const server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));


//forward to error handler
server.use((req: any, res: any, next: any) => {
    next(createError(404));
});

// error handler
server.use((err: any, req: any, res: any) => {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = server;