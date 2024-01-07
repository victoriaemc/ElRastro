const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
app.use(express.json());

const productRoutes = require('./src/routes/products');
const chatRoutes = require('./src/routes/chat');

app.use('/chat', chatRoutes);
app.use('/', productRoutes);


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once("open", () => console.log("Conected to the database!"));

app.listen(8002, () => {
    console.log("Product running on port 8002")
});