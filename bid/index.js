const express = require('express');
const mongoose = require('mongoose');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const app = express();
app.use(express.json());

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
    apis : ["./src/models/*js", "./src/routes/*.js"],
};

const specs = swaggerjsdoc(options);
app.use('/api-docs', swaggerui.serve, swaggerui.setup(specs));

app.use('/', (req, res, next) => {
    return res.status(200).json({"msg": "Bid service is running"})
})


mongoose.connect("mongodb+srv://xmariafdz:d6sNRoSlX55dLrCQ@ingweb.zuuicah.mongodb.net/elrastro", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Conected to the database!"));
app.listen(8001, () => {
    console.log("Bid running on port 8001")
});