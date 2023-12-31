// passport-setup.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./src/models/User'); // Your User model

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID_VICKY,
        clientSecret: process.env.GOOGLE_SECRET_VICKY,
        callbackURL: process.env.GATEWAY+'/users/google/callback',
        scope: ['email', 'profile'],
    },
    async (accessToken, refreshToken, profile, done) => {
        // Check if user already exists in the database
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }

        // Create a new user in the database
        const user = await new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
        }).save();
        done(null, user);
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

