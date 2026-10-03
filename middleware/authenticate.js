const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: 'You must be logged in to do this. Open /auth/login first.' });
};

module.exports = { isAuthenticated };