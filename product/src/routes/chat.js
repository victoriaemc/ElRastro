var express = require('express');
var router = express.Router();
const Messages = require('../models/Message');
const Product = require('../models/Product');

router.get("/hola", (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


router.get("/", async (req, res) => {
    try {
        const from = req.query.from;
        const productId = req.query.productId;
        const product = await Product.findById(productId).exec();
        const to = product.user._id;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
            product: productId
        }).sort({ date: 1 });

        const projectedMessages = messages.map((msg) => {
            return {
                msg
            };
        });
        res.json(projectedMessages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// POST: Enviar mensaje
router.post("/", async (req, res) => {
try {
    const from = req.body.from;
    const message = req.body.message;
    const productId = req.body.productId;

    // Agregar al remitente y al usuario del producto al array users
    const product = await Product.findById(productId);
    const usersArray = [from, product.user];

    const data = await Messages.create({
        text: message,
        sender: from,
        users: usersArray,
        product: productId,
    });

    if (data) {
        return res.json({ msg: 'Message added successfully.' });
    } else {
        return res.json({ msg: 'Failed to add message to the database' });
    }
} catch (ex) {
    console.error(ex);
    res.status(500).json({ message: ex.message });
}
});

module.exports = router;