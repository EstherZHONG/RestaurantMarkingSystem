var bcrypt = require('bcrypt');

var user_auth = module.exports = {};

user_auth.login = function(name, password, callback) {
    var salted_password = name;
    salted_password = bcrypt.hashSync(salted_password, 10);
    bcrypt.compare(password, salted_password, function (err, result) {
        if (result === true) {
            return callback(null, name +'id');
        } else {
            return callback();
        }
    });
}

module.exports = user_auth;