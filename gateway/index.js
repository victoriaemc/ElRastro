const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const mongoose = require('mongoose');

const app = express();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "El Rastro",
            version: "1.0.0",
            description: "El Rastro API",
        },
        servers: [
            {
                url: "http://localhost:8000",
            },
        ],
    },
    apis : ["../bid/src/models/*.js", "../bid/src/routes/*.js", "../product/src/models/*.js", "../product/src/routes/*.js", "../user/src/models/*.js", "../user/src/routes/*.js"],
};

const specs = swaggerjsdoc(options);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));

mongoose.connect("mongodb+srv://xmariafdz:d6sNRoSlX55dLrCQ@ingweb.zuuicah.mongodb.net/elrastro", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Conected to the database!"));

app.use(cors());
app.use(express.json());

const bidRouter = require('../bid/src/routes/bids');
const productRouter = require('../product/src/routes/products');
const userRouter = require('../user/src/routes/users');
app.use('/bids', proxy('http://localhost:8001'), bidRouter)
app.use('/users', proxy('http://localhost:8003'), userRouter)
app.use('/', proxy('http://localhost:8002'), productRouter) // Product service

app.listen(8000, () => {
    console.log("Gateway listening to port 8000")
});