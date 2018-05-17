var bcrypt = require('bcrypt');

var user_auth = module.exports = {};

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'RATING'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

user_auth.login = function(name, password, callback) {
    connection.query('SELECT * FROM USERS WHERE name = ?', name, (err,rows) => {
        if(err) throw err;
        console.log('Data received from Db:\n');
        console.log(rows);
        if (!rows.length) {
            var err = new Error('Username not existed.');
            err.status = 401;
            return callback(err);
        }
        // if (rows[0].password === password) {
            // return callback(null, rows[0].id);
        bcrypt.compare(password, rows[0].password, function (err, result) {
            if (result === true) {
                return callback(null, rows[0].id, rows[0].category);
            } else {
                var err = new Error('Wrong username or password.');
                err.status = 401;
                return callback(err);
            }
        });
        // } else {
        //     var err = new Error('Wrong username or password.');
        //     err.status = 401;
        //     return callback(err);
        // }
    });
    // var salted_password = name;
    // salted_password = bcrypt.hashSync(salted_password, 10);
    // 
    
}

module.exports = user_auth;