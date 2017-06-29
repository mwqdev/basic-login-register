const express = require('express');
const path = require('path');
const url = require('url');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const expressValidator = require('express-validator');
// const db = require('./models');
// const models = require('./models');

const index = require('./routes/index');
const users = require('./routes/users');
const todoList = require('./routes/todolist');

const app = express();

// const Sequelize = require('sequelize');
//
// const connection = new Sequelize('postgres', 'postgres', 'root', {
//         dialect: 'postgres'
//     }
// );
//
// const User = connection.define('Users', {
//         name: {
//             type: Sequelize.STRING,
//             unique: true,
//             allowNull: false
//         },
//         password: Sequelize.STRING
// //         // time: {
// //         //     type: Sequelize.DATE,
// //         //     allowNull: true,
// //         //     defaultValue: new Date()
// //         //     get: function () {
// //         //             return this.getDataValue('time').toISOString();
// //         //     }
// //         // }
// //     // },
// //     // {
// //     //     timestamps: false
//     });
// //
// connection.sync({
//     force: true,
//     logging: console.log
// })
//     .then(() => {
//         User.create({
//             name: 'admin',
//             password: 'qwer1234',
//             // time: new Date()
//         });
//     });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());
app.use(expressSession({secret: 'doublesecretprobation', saveUninitialized: true, resave: false}));

// dir path
app.use(express.static(path.join(__dirname, 'public')));

// route dirs
app.use('/', index);
app.use('/users', users);
app.use('/todolist', todoList);

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
