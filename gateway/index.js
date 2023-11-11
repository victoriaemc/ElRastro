const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/bid', proxy('http://localhost:8001'))
app.use('/user', proxy('http://localhost:8003'))
app.use('/', proxy('http://localhost:8002')) // Product service

app.listen(8000, () => {
    console.log("Gateway listening to port 8000")
});