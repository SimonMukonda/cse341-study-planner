const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth/failure' }),
    (req, res) => {
        res.redirect('/api-docs');
    }
);

router.get('/failure', (req, res) => {
    res.status(401).json({ message: 'Login failed' });
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.status(200).json({ message: 'Logged out' });
        });
    });
});

router.get('/status', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.status(200).json({
            loggedIn: true,
            user: { id: req.user.id, username: req.user.username, email: req.user.email }
        });
    }
    return res.status(200).json({ loggedIn: false });
});

module.exports = router;