const bcrypt = require('bcrypt');
const connection = require ('./connection');

const userAuth = module.exports = {};

userAuth.login = async (name, password) => {
    const [[user]] = await connection.connection.execute('SELECT id, name, password, category-1 as category FROM USERS WHERE name = ?', [name]);
    if (!user) {
        throw { message: 'Wrong username or password.' };
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
        throw { message: 'Wrong username or password.' };
    }
    return { id: user.id, category: user.category };
};

// module.exports = user_auth;