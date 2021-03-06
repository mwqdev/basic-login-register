const express = require('express');
const router = express.Router();

// Sequelize models
const models = require('../models');

let defaultUser = 'guest';

router.get('/', function (req, res) {
    // models.User.findOne({
    //     where: {
    //         name: 'admin'
    //     }
    // }).then((user) => {
    //     console.log(user);
    // });
    res.render('signin');
});

router.post('/', (req, res) => {
    // get inputs
    let name = req.body.username;
    let password = req.body.password;

    // find inputs in user storage
    models.User.findOne({
        where: {
            name: name,
            password: password
        }
    }).then((user) => {
        if (!user) {
            defaultUser = null;
            res.redirect('/users/signup');
        } else {
            req.session.user = user;
            req.session.authenticated = true;
            res.redirect('/');
        }
    });

    // let user = models.User.find({where:{name: name, password: password}});

    // if user does not exist, redirect to sign-up page, otherwise redirect back to index
    // if (!user) {
    //     // only for 'user not found' error message
    //     defaultUser = null;
    //     res.redirect('/users/signup');
    // } else {
    //     // add user's name to the session
    //     req.session.user = user;
    //     // authenticate user session
    //     req.session.authenticated = true;
    //     res.redirect('/');
    // }
});

router.get('/signup', (req, res) => {
    res.render('signup', {title: 'Authentication', user: defaultUser});
    // reset defaultUser to clear error message
    defaultUser = 'guest';
});

router.post('/signup', (req, res) => {
    // validate username length is >= 6 characters
    req.check('username', 'Username must be at least 4 characters').isLength({min: 4});
    // validate username uses only alphanumeric characters
    req.check('username', 'Username may only contain alphanumeric characters').isAlphanumeric();
    // validate the password and confirm password fields match
    req.check('password', 'Passwords must match').equals(req.body.confirmPassword);
    // validate password length is >= 6 characters
    req.check('password', 'Password must be at least 6 characters').isLength({min: 6});

    // store validation errors in an object
    let errors = req.validationErrors();

    // if errors exist, attach them to session, set success to false, and redirect
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        // show the user their validation errors so they can try again
        res.render('signup', {title: 'Authentication', errors: req.session.errors, user: defaultUser});
        // reset the errors
        req.session.errors = null;
    } else {
        // if no errors, success is true
        req.session.success = true;

        // build new user
        // let user = {
        //     name: req.body.username,
        //     password: req.body.password,
        //     clicks: 0
        // };

        let user = models.User.build({
            name: req.body.username,
            password: req.body.password
        });

        // add new user to storage
        // storage.users.push(user);
        user.save();
        // redirect so the user can now sign in
        res.redirect('/users');
    }
});

router.get('/logout', (req, res) => {
    // destroy the user's session
    req.session.destroy();
    res.redirect('/');
});

router.get('/counter', (req, res) => {
    // add one per click
    req.session.user.clicks++;
    res.redirect('/');
});

module.exports = router;
