const config = require('./config.json');
const mysql = require('mysql');

const connection = mysql.createConnection(config);
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = connection;