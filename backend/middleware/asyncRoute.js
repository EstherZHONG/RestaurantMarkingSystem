module.exports = (middleware) => (req, res, next) => {
    middleware(req, res, next)
        .catch(e => next(e));
}