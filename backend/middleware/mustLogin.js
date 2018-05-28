function mustLogin(req, res, next) {
    if (!req.session.userId) {
        throw { message: 'User not logged in', status: 401 };
    }
    next();
}

module.exports = mustLogin;