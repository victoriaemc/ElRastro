const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const mongoose = require('mongoose');
const http = require('http');

const app = express();

mongoose.connect("mongodb+srv://xmariafdz:d6sNRoSlX55dLrCQ@ingweb.zuuicah.mongodb.net/elrastro", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Connected to the database!"));

app.use(cors());
app.use(express.json());


// Rutas de proxy a microservicios
app.use('/bids', proxy('http://bid:8001'));
app.use('/users', proxy('http://user:8003'));
app.use('/', proxy('http://product:8002'));


app.listen(8000, () => {
    console.log("Gateway listening to port 8000");
});

app.use('/', (req, res) => {
    return res.status(200).json({"msg": "Welcome to El Rastro API. Please use /api-docs to see the documentation"});
});
