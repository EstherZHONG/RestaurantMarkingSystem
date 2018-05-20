const bcrypt = require('bcrypt');
const mysql = require('mysql');
const connection = require ('./connection');
const rates = [['', 'rateCR', 'rateCD'], ['rateRC', '', 'rateRD'], ['rateDC', 'rateDR', '']]
const categories = ['client', 'restaurant', 'deliverer']

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
    sqlquery = 'SELECT id, orderTime, totalPrice, ' + rates[category][(category+1)%3] + ' AS rate0, ' + rates[category][(category+2)%3] + ' AS rate1 FROM ORDERS WHERE ' + categories[category] + 'Id = ? AND (' + rates[category][(category+1)%3] + ' IS NULL OR ' + rates[category][(category+2)%3] + ' IS NULL);';
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

orders.rate = (orderId, rater, ratee, rate, callback) => {
    let sqlquery;
    // console.log('orderId:' +orderId+ 'rateCR: '+rateCR);
    try {
    sqlquery = 'UPDATE ORDERS SET ' + rates[rater][ratee] + ' = ? WHERE id = ?;';
    connection.query(sqlquery, [rate, orderId], (err) => {
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
        console.log(err);
    }
}

// module.exports = user_auth;