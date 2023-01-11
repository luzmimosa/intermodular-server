const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

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
server.use((req, res, next) => {
    next(createError(404));
});

// error handler
server.use((err, req, res, next) => {
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

module.exports = server;