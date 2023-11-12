var express = require('express');
var router = express.Router();
//const User = require('../models/User');
//const Bid = require('../models/Bid');
const Product = require('../models/Product');
const User = require("../models/User");
//var bodyParser = require('body-parser');

/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the product
 *              description:
 *                  type: string
 *                  description: Description of the product
 *              user:
 *                  type: ObjectId
 *                  description: User selling the product
 *              startingPrice:
 *                  type: number
 *                  description: Starting price of the product
 *                  default: 0.0
 *              lastBid:
 *                  type: number
 *                  description: Last bid of the product
 *                  default: 0.0
 *              latitude:
 *                  type: string
 *                  description: Latitude of the product
 *              longitude:
 *                  type: string
 *                  description: Longitude of the product
 *              publicationDate:
 *                  type: Date
 *                  description: Publication date of the product
 *                  default: Date.now
 *              endingDate:
 *                  type: Date
 *                  description: Date and time when the bidding ends
 *              finished:
 *                  type: boolean
 *                  description: Indicates if the bidding has ended
 *                  default: false
 *          required:
 *              - name
 *              - user
 *              - startingPrice
 *              - lastBid
 *              - latitude
 *              - longitude
 *              - publicationDate
 *              - endingDate
 *              - finished
 *          example:
 *              name: iPhone 12
 *              description: Smartphone
 *              user: 5f9d7b7b9c9a7b1b1c9a7b1b
 *              startingPrice: 500
 *              lastBid: 500
 *              latitude: 40.4167
 *              longitude: 3.70325
 *              publicationDate: 2020-10-31T12:00:00.000Z
 *              endingDate: 2020-11-30T12:00:00.000Z
 *              finished: false
 *
 */

/* GET products listing. */
/**
 * @swagger
 * /products:
 *  get:
 *    summary: Get all products
 *    description: Get all products
 *    tags: [Product]
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 */
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().exec();
        res.json(products);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Find Auction By ID
/**
 * @swagger
 * /products/{id}:
 *  get:
 *    summary: Find Auction by ID
 *    description: Get the auction corresponding to an ID
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 */
router.get("/:id", (req, res) => {
    Product.findById(req.params.id)
           .then(product => {
                if(product){
                    res.json(product);
                }else{
                    res.status(404).json({message: "User not found"});
                }
           }).catch(err => {
                res.status(500).json({ message: err.message });
           });
});

// Devuelve los productos a la venta de un usuario
/**
 * @swagger
 * /products/myProducts/{id}:
 *  get:
 *    summary: Products sold by user
 *    description: Get all products sold by an user
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 */
router.get("/myProducts/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const products = await Product.find({ user: id }).exec();
        res.json(products);
    } catch (err) {
        res.json({ message: err.message });
    }
});

/**
 * @swagger
 * /products/finished/{finished}:
 *  get:
 *    summary: Finished/unfinished auctions
 *    description: Get products depending on whether their sale is finished or not.
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: finished
 *        schema:
 *          type: boolean
 *        required: true
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 */
// Devuelve las subastas finalizadas o no

router.get("/finished/:finished", async (req, res) => {
    try {
        const finishedValue = req.params.finished;
        const products = await Product.find({ finished: finishedValue }).exec();
        res.json(products);
    } catch (err) {
        res.json({ message: err.message });
    }
});

/**
 * @swagger
 * /products/greaterThan/{amount}:
 *  get:
 *    summary: Filter by last bid
 *    description: Get products whose last bid is greater than a given amount.
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: amount
 *        schema:
 *          type: number
 *        required: true
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 */

// Devuelve los productos cuya ultima puja sea mayor a una cantidad
router.get("/greaterThan/:amount", async (req, res) => {
    try {
        const amountValue = req.params.amount;
        const products = await Product.find({ lastBid: { $gt: amountValue } }).exec();
        res.json(products);
    } catch (err) {
        res.json({ message: err.message });
    }
});

/**
 * @swagger
 * /products/lowerThan/{amount}:
 *  get:
 *    summary: Filter by last bid
 *    description: Get products whose last bid is lower than a given amount.
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: amount
 *        schema:
 *          type: number
 *        required: true
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 */

// Devuelve los productos cuya ultima puja sea inferior a una cantidad
router.get("/lowerThan/:amount", async (req, res) => {
    try {
        const amountValue = req.params.amount;
        const products = await Product.find({ lastBid: { $lt: amountValue } }).exec();
        res.json(products);
    } catch (err) {
        res.json({ message: err.message });
    }
});

/**
 * @swagger
 * /products/before/{hours}:
 *  get:
 *    summary: Recently posted products
 *    description: Get products that have been posted in the last :hours hours.
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: hours
 *        schema:
 *          type: number
 *        required: true
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 */

// Devuelve los productos publicados en las últimas :hours horas
router.get("/before/:hours", async (req, res) => {
    try {
        const hours = parseFloat(req.params.hours);
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

/**
 * @swagger
 * /products/add:
 *    post:
 *     summary: Add product
 *     description: Add a new product to the database.
 *     tags: [Product]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               user:
 *                 type: string
 *               startingPrice:
 *                 type: number
 *               lastBid:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               publicationDate:
 *                 type: string
 *                 format: date-time # Cambiado a tipo Date
 *               endingDate:
 *                 type: string
 *                 format: date-time # Cambiado a tipo Date
 *               finished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto añadido con éxito
 *         content:
 *           application/json:
 *             example:
 *                 name: iPhone 12
 *                 description: Smartphone
 *                 user: 5f9d7b7b9c9a7b1b1c9a7b1b
 *                 startingPrice: 500
 *                 lastBid: 500
 *                 latitude: 40.4167
 *                 longitude: 3.70325
 *                 publicationDate: 2020-10-31T12:00:00.000Z
 *                 endingDate: 2020-11-30T12:00:00.000Z
 *                 finished: false
 */

router.post("/add", async (req, res) => {
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
            finished: req.body.finished
        });

        await product.save();
        res.json(product);
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

/**
 * @swagger
 * /products/delete/{productId}:
 *  delete:
 *    summary: Delete product
 *    description: Delete a prodcut given an ID
 *    tags: [Product]
 *    parameters:
 *      - in: path
 *        name: productId
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *          description: Success
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product'
 */

router.delete("/delete/:productId", (req, res) => {
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

/**
 * @swagger
 * /products/update/{productId}:
 *   put:
 *     summary: Update product
 *     description: Change the values of a product given an ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               user:
 *                 type: string
 *               startingPrice:
 *                 type: number
 *               lastBid:
 *                 type: number
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               publicationDate:
 *                 type: string
 *                 format: date-time
 *               endingDate:
 *                 type: string
 *                 format: date-time
 *               finished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto actualizado con éxito
 *         content:
 *           application/json:
 *             example:
 *               name: iPhone 12 Pro
 *               description: Smartphone avanzado
 *               user: 5f9d7b7b9c9a7b1b1c9a7b1b
 *               startingPrice: 600
 *               lastBid: 600
 *               latitude: 40.4167
 *               longitude: 3.70325
 *               publicationDate: 2020-10-31T12:00:00.000Z
 *               endingDate: 2020-12-15T12:00:00.000Z
 *               finished: true
 */

router.put("/update/:productId", async (req, res) => {
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
            finished: req.body.finished
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

/**
 * @swagger
 * /products/currency/{id}/{currency}:
 *  get:
 *      summary: Get product info in another currency
 *      description: Get base price and last bid of a product in another currency, given the product ID and the currency code.
 *      tags: [Product]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *      - in: path
 *        name: currency
 *        schema:
 *          type: string
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *
 */
router.get("/currency/:id/:currency", async (req, res) => {
    try {
        const id = req.params.id;
        const currency = req.params.currency;
        const product = await Product.findById(id).exec();

        if (product) {
            const startingPrice = product.startingPrice;
            const lastBid = product.lastBid;

            const startingPriceInCurrency = await convertCurrency(startingPrice, currency);
            const lastBidInCurrency = await convertCurrency(lastBid, currency);

            res.json({
                name: product.name,
                description: product.description,
                user: product.user,
                startingPrice: startingPriceInCurrency,
                lastBid: lastBidInCurrency
            });
        } else {
            res.json({ message: 'Product not found', type: 'danger' });
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

module.exports = router;