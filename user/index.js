const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

const userRoutes = require('./src/routes/users')
const ratingRoutes = require('./src/routes/ratings')
app.use('/', ratingRoutes);
app.use('/', userRoutes);


app.use('/', (req, res, next) => {
    return res.status(200).json({"msg": "User service is running"})
})

mongoose.connect("mongodb+srv://xmariafdz:d6sNRoSlX55dLrCQ@ingweb.zuuicah.mongodb.net/elrastro", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Conected to the database!"));


app.listen(8003, () => {
    console.log("User running on port 8003")
});