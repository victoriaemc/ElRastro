const express = require('express');
const passport = require('passport');
const cors = require('cors');
const router = express.Router();
const User = require('../models/User');
router.use(cors());

router.get('/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        error: true,
        message: 'User failed to authenticate.'
    });
});

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: 'User has successfully authenticated.',
            user: req.user
        });
    }else {
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
        if (err) {
            return next(err);
        }
        res.redirect(process.env.CLIENT);
    });
});

module.exports = router;