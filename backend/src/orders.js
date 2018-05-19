const bcrypt = require('bcrypt');
const mysql = require('mysql');
const connection = require ('./connection');

const orders = module.exports = {};

orders.getUnrated = (id, category, callback) => {
    let sqlquery;
    // if (category === 'CLIENT') {
    //     sqlquery = 'SELECT * FROM ORDERS WHERE clientId = ? AND (rateCD IS NULL OR rateCR IS NULL)';
    // } else if (category === 'RESTAURANT') {
    //     sqlquery = 'SELECT * FROM ORDERS WHERE restaurantId = ? AND (rateRD IS NULL OR rateRC IS NULL)';
    // // } else if (category === 'RESTAURANT') {
    // } else {
    //     sqlquery = 'SELECT * FROM ORDERS WHERE delivererId = ? AND (rateDR IS NULL OR rateDC IS NULL)';
    // }
    sqlquery = 'SELECT * FROM ORDERS WHERE clientId = ? AND rateCR IS NULL;';
    connection.query(sqlquery, id, (err,rows) => {
        // if(err) throw err;
        if (err) return callback(err);
        console.log('Data received from Db:\n');
        console.log(rows);
        // if (!rows.length) {
        //     return callback();
        // }
        return callback(null, rows);
    });
    
}

orders.rate = (orderId, rateCR, callback) => {
    let sqlquery;
    sqlquery = 'UPDATE ORDERS SET rateCR = ? WHERE id = ?;';
    // console.log('orderId:' +orderId+ 'rateCR: '+rateCR);
    try {


    connection.query(sqlquery, [rateCR, orderId], (err) => {
        // if(err) throw err;
        if (err) throw err;
        // console.log('Data received from Db:\n');
        // console.log(rows);
        // if (!rows.length) {
        //     const err = new Error('No specified order');
        //     err.status = 400;
        //     return callback(err);
        // }
        return callback(null, true);
    });
    } catch (err) {
        console.log("arrive here");
        console.log(err);
    }
}

// module.exports = user_auth;