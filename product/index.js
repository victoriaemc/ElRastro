const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

app.use('/', (req, res, next) => {
    return res.status(200).json({"msg": "Product service is running"})
})

mongoose.connect("mongodb+srv://xmariafdz:d6sNRoSlX55dLrCQ@ingweb.zuuicah.mongodb.net/elrastro", {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Conected to the database!"));

app.listen(8002, () => {
    console.log("Product running on port 8002")
});