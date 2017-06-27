const express = require('express');
const path = require('path');
const url = require('url');
// const cookieParser = require('cookie-parser'); not needed
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const expressValidator = require('express-validator');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(bodyParser.json()); not used
// app.use(cookieParser()); not needed

// middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(expressSession({secret: 'doublesecretprobation', saveUninitialized: true, resave: false}));

// dir path
app.use(express.static(path.join(__dirname, 'public')));

// route dirs
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
