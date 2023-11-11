const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

app.use('/', (req, res, next) => {
    return res.status(200).json({"msg": "Product service is running"})
})

app.listen(8002, () => {
    console.log("Product running on port 8002")
});