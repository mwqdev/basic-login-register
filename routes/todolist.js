const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    // check for session and authentication
    if (!req.session || !req.session.authenticated) {
        res.redirect('/users');
    } else {
        res.render('todolist', {title: 'Todo List', user: req.session.user.name, tasks: req.session.user.tasks});
    }
});

module.exports = router;
