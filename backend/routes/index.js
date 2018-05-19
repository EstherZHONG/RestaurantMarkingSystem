const express = require('express');
const user_auth = require('./../src/user_auth');
const orders = require ('./../src/orders');
const router = express.Router();

// const bodyParser = require('body-parser');
// const multer = require('multer');

// router.use(bodyParser.json()); // for parsing application/json
// router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

/* POST user login */
router.post('/login', (req, res, next) => {
    // console.log(req.session.id);
    // console.log(req.body);
    // res.send('user-login: username: ' + req.body.name + '; password: ' + req.body.password + '\n');
    user_auth.login(req.body.name, req.body.password, (err, id, category) => {
        if (err) {
            return next(err);
            // res.status(err.number).json({'message': err.message}).end();
        } else if (!id) {
            // res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.status(400).json({'message': 'Wrong username or password.'}).end();
            // const err = new Error('Wrong username or password.');
            // err.status = 400;
            // return next(err);
        } else {
            req.session.userId = id;
            req.session.category = category;
            // console.log(req.session.id);
            // console.log(req.session.userId);
            // res.setHeader('Access-Control-Allow-Credentials', 'true');
            res.status(200).json({'id': id, 'category': category}).end();
        }
    });
});

router.get('/user', (req, res) => {
    // console.log(req.session);
    // console.log(req.session.id);
    // console.log(req.session.userId);

    if (req.session.userId) {
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.status(200).json({'id': req.session.userId, 'category': req.session.category}).end();
    } else {
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.status(401).json({'message': 'User not logged in.'}).end();
        // const err = new Error('User not logged in.');
        // err.status = 401;
        // return err;
        // res.status(401).json({'message': }).end();
    }
});

/* GET user logout */
router.get('/logout', (req, res, next) => {
    // if (req.session.userId) {
    req.session.destroy(function (err) {
        // if (err) {
        //     // res.status(err.number).json({'message': err.message}).end();
        //     return next(err);
        // } else {
        //     // return res.redirect('/');
        //     res.status(204).end();
        // }
        console.log(err);
    });
    // console.log(req.session.id);
    // req.sessi on = null;
    // console.log(req.session);
    res.status(204).end();
    // } else {
    //     const err = new Error('User hasn\'t logged-in');
    //     err.status = 401;
    //     return next(err);
    // }
});

router.get('/unrated', (req, res) => {
    if (!req.session.userId) {
        res.status(401).json({'message': 'User not logged in.'}).end();
    } else if (req.session.category == 'CLIENT') {

    }
});

module.exports = router;
