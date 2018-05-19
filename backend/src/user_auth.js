const bcrypt = require('bcrypt');
const mysql = require('mysql');
const connection = require ('./connection');

const user_auth = module.exports = {};

user_auth.login = (name, password, callback) => {
    connection.query('SELECT * FROM USERS WHERE name = ?', name, (err,rows) => {
        if(err) throw err;
        console.log('Data received from Db:\n');
        console.log(rows);
        if (!rows.length) {
            // const err = new Error('Wrong username or password.');
            // err.status = 400;
            // return callback(err);
            return callback();
        }
        // if (rows[0].password === password) {
            // return callback(null, rows[0].id);
        bcrypt.compare(password, rows[0].password, (err, result) => {
            if (result === true) {
                return callback(null, rows[0].id.toString(), rows[0].category);
            } else {
                // const err = new Error('Wrong username or password.');
                // err.status = 400;
                // return callback(err);
                return callback();
            }
        });
        // } else {
        //     const err = new Error('Wrong username or password.');
        //     err.status = 401;
        //     return callback(err);
        // }
    });
    // const salted_password = name;
    // salted_password = bcrypt.hashSync(salted_password, 10);
    // 
    
}

// module.exports = user_auth;