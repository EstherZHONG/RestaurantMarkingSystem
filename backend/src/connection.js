const config = require('./config.json');
const mysql = require('mysql2/promise');

mysql.createConnection(config)
.then(
    ret => { console.log('Connected!'); module.exports.connection = ret; },
    err => { console.error(err); }
);

module.exports = {};
