const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const app = express();
require('dotenv').config();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'https://vemc-frontend.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require('./src/routes/users')
const ratingRoutes = require('./src/routes/ratings')
const authRoutes = require('./src/routes/auth')
app.use('/', ratingRoutes);
app.use('/', userRoutes);
app.use('/', authRoutes);


app.use('/', (req, res, next) => {
    return res.status(200).json({"msg": "User service is running"})
})

mongoose.connect("mongodb+srv://xmariafdz:d6sNRoSlX55dLrCQ@ingweb.zuuicah.mongodb.net/elrastro4", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Conected to the database!"));

require('./passport-setup');

app.listen(8003, () => {
    console.log("User running on port 8003")
});