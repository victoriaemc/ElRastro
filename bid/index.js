const express = require('express');
const app = express();
app.use(express.json());

app.use('/', (req, res, next) => {
    return res.status(200).json({"msg": "Bid service is running"})
})

app.listen(8001, () => {
    console.log("Bid running on port 8001");
});