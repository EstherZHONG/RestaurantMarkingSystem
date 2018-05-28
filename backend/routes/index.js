const express = require('express');
const userAuth = require('../src/userAuth');
const orders = require ('../src/orders');
const mustLogin = require('../middleware/mustLogin');
const asyncRoute = require('../middleware/asyncRoute');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'Express' });
});

/* POST user login */
router.post('/login', asyncRoute(async (req, res, next) => {
    try {
        const { id, category } = await userAuth.login(req.body.name, req.body.password);
        req.session.userId = id;
        req.session.category = category;
        res.status(200).json({ id, category }).end();        
    } catch (e) {
        // console.log(e.stack);
        throw { message: e.message, status: 400 };
    }
}));

router.get('/user', mustLogin, (req, res) => {
    res.status(200).json({id: req.session.userId, category: req.session.category}).end();
});

/* GET user logout */
router.get('/logout', (req, res, next) => {
    delete req.session.userId;
    delete req.session.category;
    res.status(204).end();
});

router.get('/unrated', mustLogin, asyncRoute(async (req, res) => {
    try {
        const result = await orders.getUnrated(req.session.userId, req.session.category);   
        res.status(200).json({
            id: req.session.userId,
            category: req.session.category,
            orders: result,
        }).end();
    } catch(e) {
        // console.log(e.stack);
        throw { message: 'Unable to fetch data', status: 500 };
    }
}));

router.post('/rate', mustLogin, asyncRoute(async (req, res, next) => {
    try {
        await orders.rate(req.body.orderId, req.body.rater, req.body.ratee, req.body.rate);
        res.status(204).end();
    } catch(e) {
        throw { message: e.message, status: e instanceof Error ? 500 : 400 };
    }
}));

module.exports = router;
