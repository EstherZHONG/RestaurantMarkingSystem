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
    user_auth.login(req.body.name, req.body.password, function(err, id, category) {
        if (err) {
            return next(err);
        } else if (!id) {
            var err = new Error('Wrong username or password.');
            err.status = 401;
            return next(err);
        } else {
            req.session.userId = id;
            req.session.category = category;
            res.send('login as user: ' + id);
        }
    });
});

/* GET user logout */
router.get('/logout', function(req, res, next) {
    if (req.session.userId) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                // return res.redirect('/');
                return res.send('Logout successfully');
            }
        });
    } else {
        var err = new Error('User hasn\'t logged-in');
        err.status = 401;
        return next(err);
    }
});

module.exports = router;
