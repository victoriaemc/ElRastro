const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const router = express.Router();
const User = require('../models/User');
router.use(cors(
    {
        credentials: true,
        origin: process.env.CLIENT
    }
));

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        error: true,
        message: 'User failed to authenticate.'
    });
});

router.get('/login/success', (req, res) => {
    if (req.user) {
        // CORS headers
        res.header("Access-Control-Allow-Origin", process.env.CLIENT);
        res.header("Access-Control-Allow-Credentials", true);

        res.status(200).json({
            success: true,
            message: 'User has successfully authenticated.',
            user: req.user
        });
    }else {
        // CORS headers
        res.header("Access-Control-Allow-Origin", process.env.CLIENT);
        res.header("Access-Control-Allow-Credentials", true);

        res.status(403).json({
            error: true,
            message: 'Not authenticated.'
        });
    }
});

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login/failed',
    successRedirect: process.env.CLIENT})
);

router.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        // CORS headers
        res.header("Access-Control-Allow-Origin", process.env.CLIENT);
        res.header("Access-Control-Allow-Credentials", true);
        if (err) {
            console.error(err);
            return next(err);
        }
        // Clear the session cookie
        req.session = null;
        res.redirect(process.env.CLIENT);
    });
});

module.exports = router;