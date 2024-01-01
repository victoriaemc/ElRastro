var express = require('express');
var router = express.Router();
//const User = require('../models/User');
const Bid = require('../models/Bid');
//const Product = require('../models/Product');
//var bodyParser = require('body-parser');

// Get a bid and output the amount bid in another currency (using external API)
async function convertCurrency(baseAmount, currencyCode) {
    const response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/eur/${currencyCode}.json`);

    if (response.ok) {
        const data = await response.json();

        // Verifica si la propiedad currencyCode existe en la respuesta
        if (data.hasOwnProperty(currencyCode)) {
            const rate = data[currencyCode];
            return rate * baseAmount;
        } else {
            console.log('Currency code not found');
            return null; // Devuelve null si no se encuentra el código de moneda
        }
    } else {
        throw new Error('Failed to fetch currency data');
    }
}

// GET all bids listing. -> localhost:8000/bids
// Si se especifica el parámetro ?user=userid, devuelve las pujas de ese usuario -> localhost:8000/bids?user=654926ac75aa4e12761f4ab4
// Si se especifica el parámetro ?product=productid, devuelve las pujas de ese producto -> localhost:8000/bids?product=6549293875aa4e12761f4ac4
// Si se especifica el parámetro ?before=n, devuelve las pujas realizadas en las últimas n horas -> localhost:8000/bids?before=2
// Si se especifica el parámetro ?amount=n, devuelve las pujas con un precio mayor que n -> localhost:8000/bids?amount=20
router.get("/", async (req, res) => {
    try {
        let userId = req.query.user;
        let productId = req.query.product;
        let before = parseFloat(req.query.before);
        let amount = parseFloat(req.query.amount);

        if (userId) {
            // localhost:8000/bids?user=654a09ac75aa4e12761f4add
            const bids = await Bid.find({ user: userId }).exec();
            res.json(bids);
        } else if (productId) {
            // localhost:8000/bids?product=654a09ac75aa4e12761f4add
            const bids = await Bid.find({ product: productId }).exec();
            res.json(bids);
        } else if (before) {
            // Validate if 'before' parameter is a valid number
            if (isNaN(before)) {
                return res.status(400).json({ message: "Invalid 'before' parameter. Please provide a valid number of hours." });
            }
            // Obtener la fecha actual menos n horas
            const currentDateMinusNHours = new Date();
            currentDateMinusNHours.setMilliseconds(currentDateMinusNHours.getMilliseconds() - before * 3600 * 1000);
            const bids = await Bid.find({ date: { $gte: currentDateMinusNHours, $lte: new Date() } }).exec();
            res.json(bids);
        } else if (amount) {
            if (isNaN(amount)) {
                return res.status(400).json({ message: "Invalid 'amount' parameter. Please provide a valid numeric amount." });
            }
            const bids = await Bid.find({ price: { $gt: amount } }).exec();
            res.json(bids);
        } else {
            // If no query parameters specified, get all bids
            // localhost:8000/bids
            const bids = await Bid.find().exec();
            res.json(bids);
        }

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Devuelve la puja más alta sobre un producto, por ejemplo:
// http://localhost:8000/bids/highestBid?product=6576eb0f255ebb18bc49cacd
router.get("/highestBid", async (req, res) => {
    try {
        const productId = req.query.product;

        if (!productId) {
            return res.status(400).json({ message: "Missing 'product' parameter. Please provide a valid product ID." });
        }

        // Buscar la oferta más alta para un producto específico
        const highestBid = await Bid.findOne({ product: productId })
            .sort({ price: -1 }) // Ordenar en orden descendente según el precio
            .exec();

        res.json(highestBid);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Devuelve una puja por su id -> localhost:8000/bids/654a09ac75aa4e12761f4add
// Si se especifica el parámetro ?currency=XXX, devuelve el precio en la moneda especificada
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const currency = req.query.currency;

        if (currency) {
            // Convert to the specified currency
            const bid = await Bid.findById(id).exec();
            const amount = bid.price;
            const amountInCurrency = await convertCurrency(amount, currency);
            res.json({
                user: bid.user,
                product: bid.product,
                price: amountInCurrency
            });
        } else {
            const bid = await Bid.findById(id).exec();
            res.json(bid);
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// Añade una puja
router.post("/", (req, res) => {
    const bid = new Bid({
        product: req.body.product,
        user: req.body.user,
        price: req.body.price,
        date: req.body.date
    });
    bid.save()
        .then(data => res.json(data))
        .catch(err => res.json({ message: err.message }));
});
// Modifica una puja
router.put("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const update = req.body; // Assuming the request body contains the updated bid data

        // `new: true` option returns the modified document rather than the original
        const updatedBid = await Bid.findOneAndUpdate({ _id: id }, update, { new: true });

        if (updatedBid) {
            res.json(updatedBid);
        } else {
            res.status(404).json({ message: "Bid not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Borra una puja
router.delete("/:id", (req, res) => {
    let id = req.params.id;
    Bid.findByIdAndDelete(id)
        .then(() => res.json({ message: "Bid deleted" }))
        .catch(err => res.json({ message: err.message }));
});

module.exports = router;