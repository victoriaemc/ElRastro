var express = require('express');
var router = express.Router();
//const User = require('../models/User');
//const Bid = require('../models/Bid');
const Product = require('../models/Product');
//const User = require("../models/User");
//var bodyParser = require('body-parser');



// Devuelve las subastas finalizadas o no (Boolean true/false)
// localhost:8000/finished?value=true
router.get("/finished", async (req, res) => {
    try {
        const finishedValue = Boolean(req.query.value === 'true');

        const products = await Product.find({ finished: finishedValue }).exec();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


// Devuelve los productos cuya ultima puja sea mayor a una cantidad
// localhost:8000/greaterThan?amount=100
router.get("/greaterThan", async (req, res) => {
    try {
        const greaterThanValue = req.query.amount;

        // Ensure that greaterThanValue is a valid number before querying the database
        if (isNaN(greaterThanValue)) {
            return res.status(400).json({ message: "Invalid 'greaterThan' value. Must be a number." });
        }

        const products = await Product.find({ lastBid: { $gt: greaterThanValue } }).exec();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Devuelve los productos cuya ultima puja sea inferior a una cantidad
// localhost:8000/lowerThan?amount=100
router.get("/lowerThan", async (req, res) => {
    try {
        const lowerThanValue = req.query.amount;

        // Ensure that lowerThanValue is a valid number before querying the database
        if (isNaN(lowerThanValue)) {
            return res.status(400).json({ message: "Invalid 'lowerThan' value. Must be a number." });
        }

        const products = await Product.find({ lastBid: { $lt: lowerThanValue } }).exec();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Devuelve los productos publicados en las últimas n horas
// localhost:8000/before?hours=2
router.get("/before", async (req, res) => {
    try {
        const hours = parseFloat(req.query.hours);

        // Ensure that hours is a valid number before proceeding
        if (isNaN(hours)) {
            return res.status(400).json({ message: "Invalid 'hours' value. Must be a number." });
        }

        const currentDateMinusNHours = new Date();
        currentDateMinusNHours.setMilliseconds(currentDateMinusNHours.getMilliseconds() - hours * 3600 * 1000);

        const products = await Product.find({
            publicationDate: { $gte: currentDateMinusNHours, $lte: new Date() }
        }).exec();

        res.json(products);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Get a list of products that contain the search string in either the name or the description
// http://localhost:8000/?search=iphone
router.get(["/search", "/"], async (req, res) => {
    try {
        const searchString = req.query.searchString || req.query.search;

        const queryConditions = searchString
            ? {
                $or: [
                    { name: { $regex: searchString, $options: 'i' } },
                    { description: { $regex: searchString, $options: 'i' } }
                ]
            }
            : {};

        const products = await Product.find(queryConditions).sort({ publicationDate: -1 }).exec();

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: err.message, type: 'danger' });
    }
});


// Devuelve los productos a la venta de un usuario, dada la ID del usuario
// localhost:8000/myProducts?user=654926ac75aa4e12761f4ab5
router.get("/myProducts", async (req, res) => {
    try {
        let userId = req.query.user;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required in the query parameter "user"' });
        }

        const products = await Product.find({ user: userId }).exec();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Get a product and output its starting bid and latest bid in another currency (using external api)
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

// Get product info in another currency (given the product ID and the currency code)
// localhost:8000/6549293875aa4e12761f4ac5?currency=cny
// Can also be used to just get product back in original currency (without specifying currency query parameter)
// localhost:8000/6549293875aa4e12761f4ac5
router.get("/:productId", async (req, res) => {
    try {
        const productId = req.params.productId;
        const currency = req.query.currency;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required." });
        }

        const product = await Product.findById(productId).exec();

        if (product) {
            const startingPrice = product.startingPrice;
            const lastBid = product.lastBid;

            let startingPriceInCurrency, lastBidInCurrency;

            if (currency) {
                // Convert to the specified currency
                startingPriceInCurrency = await convertCurrency(startingPrice, currency);
                lastBidInCurrency = await convertCurrency(lastBid, currency);
            } else {
                // Use the original currency
                startingPriceInCurrency = startingPrice;
                lastBidInCurrency = lastBid;
            }

            res.json({
                name: product.name,
                description: product.description,
                user: product.user,
                startingPrice: startingPriceInCurrency,
                lastBid: lastBidInCurrency,
                latitude: product.latitude,
                longitude: product.longitude,
                publicationDate: product.publicationDate,
                endingDate: product.endingDate,
                finished: product.finished,
                imageId: product.imageId,
                payed: product.payed
            });
        } else {
            res.json({ message: 'Product not found', type: 'danger' });
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


/* GET products listing. */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ publicationDate: -1 }).exec();
        res.json(products);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// POST request to add a new product
router.post("/", async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            user: req.body.user,
            startingPrice: req.body.startingPrice,
            lastBid: req.body.lastBid,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            publicationDate: req.body.publicationDate,
            endingDate: req.body.endingDate,
            imageId: req.body.imageId,
            finished: req.body.finished,
            payed: req.body.payed
        });

        await product.save();
        res.json(product);
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});


// Update a product given its ID
router.put("/:productId", async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProduct = {
            name: req.body.name,
            description: req.body.description,
            user: req.body.user,
            startingPrice: req.body.startingPrice,
            lastBid: req.body.lastBid,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            publicationDate: req.body.publicationDate,
            endingDate: req.body.endingDate,
            imageId: req.body.imageId,
            finished: req.body.finished,
            payed: req.body.payed
        };

        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });

        if (product) {
            res.json(product);
        } else {
            res.json({ message: 'Product not found', type: 'danger' });
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Delete a product given its ID
router.delete("/:productId", (req, res) => {
    const productId = req.params.productId;

    Product.findByIdAndDelete(productId)
        .then(product => {
            if (product) {
                res.json({ message: 'Product deleted successfully!' });
            } else {
                res.json({ message: 'Product not found', type: 'danger' });
            }
        })
        .catch(err => {
            res.json({ message: err.message, type: 'danger' });
        });
});

module.exports = router;