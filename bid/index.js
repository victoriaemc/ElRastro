const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
app.use(express.json());

const bidRoutes = require('./src/routes/bids')
app.use('/', bidRoutes);

app.use('/', (req, res, next) => {
    return res.status(200).json({"msg": "Bid service is running"})
})


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Conected to the database!"));
app.listen(8001, () => {
    console.log("Bid running on port 8001")
});