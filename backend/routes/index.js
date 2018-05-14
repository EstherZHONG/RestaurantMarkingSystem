var express = require('express');
var user_auth = require('./../src/user_auth');
var router = express.Router();

// var bodyParser = require('body-parser');
// var multer = require('multer');

// router.use(bodyParser.json()); // for parsing application/json
// router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* POST user login */
router.post('/login', function(req, res, next) {
    console.log(req.body);
    // res.send('user-login: username: ' + req.body.name + '; password: ' + req.body.password + '\n');
    user_auth.login(req.body.name, req.body.password, function(err, id) {
        if (err) {
            return next(err);
        } else if (!id) {
            var err = new Error('Wrong username or password.');
            err.status = 401;
            return next(err);
        } else {
            res.send('login as user: ' + id);
        }
    });
});

module.exports = router;
