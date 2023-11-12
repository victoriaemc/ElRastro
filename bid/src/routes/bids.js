var express = require('express');
var router = express.Router();
//const User = require('../models/User');
const Bid = require('../models/Bid');
//const Product = require('../models/Product');
//var bodyParser = require('body-parser');


/**
 * @swagger
 * components:
 *  schemas:
 *      Bid:
 *          type: object
 *          properties:
 *              product:
 *                  type: ObjectId
 *                  description: Product being bid for
 *              user:
 *                  type: ObjectId
 *                  description: User placing the bid
 *              price:
 *                  type: number
 *                  description: amount of the bid
 *
 *          required:
 *              - product
 *              - user
 *              - price
 *          example:
 *              product: 6549293875aa4e12761f4ac4
 *              user: 654926ac75aa4e12761f4ab4
 *              price: 1000
 *
 */

/* GET bids listing. */
/**
 * @swagger
 * /bids:
 *  get:
 *    summary: Get all bids
 *    description: Get all bids in database
 *    tags: [Bid]
 *    responses:
 *      200:
 *          description: Success
 */
router.get("/", (req, res) => {
    Bid.find()
        .then(bids => res.json(bids))
        .catch(err => res.json({ message: err.message }));
});

// Devuelve una puja por su id
/**
 * @swagger
 * /bids/{id}:
 *  get:
 *      summary: Get bid by id
 *      description: Get bid that matches the id
 *      tags: [Bid]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Bid'
 *
 */

router.get("/:id", (req, res) => {
    let id = req.params.id;
    Bid.findById(id)
        .then(bid => {
            if (bid) {
                res.json(bid);
            } else {
                res.status(404).json({ message: "Bid not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Añade una puja
/**
 * @swagger
 * /bids/add:
 *  post:
 *      summary: Add bid
 *      description: Add a new bid
 *      tags: [Bid]
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Bid'
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Bid'
 *
 */
router.post("/add", (req, res) => {
    const bid = new Bid({
        product: req.body.product,
        user: req.body.user,
        price: req.body.price
    });
    bid.save()
        .then(data => res.json(data))
        .catch(err => res.json({ message: err.message }));
});

// Borra una puja
/**
 * @swagger
 * /bids/{id}:
 *  delete:
 *      summary: Delete bid
 *      description: Delete a bid
 *      tags: [Bid]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *
 */
router.delete("/:id", (req, res) => {
    let id = req.params.id;
    Bid.findByIdAndDelete(id)
        .then(() => res.json({ message: "Bid deleted" }))
        .catch(err => res.json({ message: err.message }));
});

// Modifica una puja
/**
 * @swagger
 * /bids/{id}:
 *  put:
 *      summary: Update bid
 *      description: Update a bid
 *      tags: [Bid]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Bid'
 *      responses:
 *          200:
 *              description: Success
 *
 */

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

// Devuelve las pujas realizadas en las últimas :hours horas
/**
 * @swagger
 * /bids/before/{hours}:
 *  get:
 *      summary: Get bids newer than n hours
 *      description: Get bids that were placed in the last n hours
 *      tags: [Bid]
 *      parameters:
 *      - in: path
 *        name: hours
 *        schema:
 *          type: number
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Bid'
 *
 */
router.get("/before/:hours", (req, res) => {
    const hours = parseFloat(req.params.hours);
    // Obtener la fecha actual menos n horas
    const currentDateMinusNHours = new Date();
    currentDateMinusNHours.setMilliseconds(currentDateMinusNHours.getMilliseconds() - hours * 3600 * 1000);
    Bid.find({ date: { $gte: currentDateMinusNHours, $lte: new Date() } })
        .then(bids => res.json(bids))
        .catch(err => res.json({ message: err.message }));
});



// Devuelve las pujas realizadas por un usuario
/**
 * @swagger
 * /bids/user/{id}:
 *  get:
 *      summary: Get bids by user
 *      description: Get bids that were placed by a user
 *      tags: [Bid]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Bid'
 *
 */

router.get("/user/:id", async (req, res) => {
    try {
        let id = req.params.id;
        const bids = await Bid.find({ user: id }).exec();
        res.json(bids);
    } catch (err) {
        res.json({ message: err.message });
    }
});

// Devuelve las pujas realizadas en un producto
/**
 * @swagger
 * /bids/product/{id}:
 *  get:
 *      summary: Get bids by product
 *      description: Get bids that were placed in a product
 *      tags: [Bid]
 *      parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Bid'
 *
 */
router.get("/product/:id", (req, res) => {
    let id = req.params.id;
    Bid.find({ product: id })
        .then(bids => {
            if (bids.length > 0) {
                res.json(bids);
            } else {
                res.status(404).json({ message: "No bids found for this product" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Bids greater than specified amount
/**
 * @swagger
 * /bids/greaterThan/{amount}:
 *  get:
 *      summary: Get bids greater than specified amount
 *      description: Get bids wich amount is greater than the reference value
 *      tags: [Bid]
 *      parameters:
 *      - in: path
 *        name: amount
 *        schema:
 *          type: number
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Bid'
 *
 */
router.get("/greaterThan/:amount", (req, res) => {
    const amount = parseInt(req.params.amount,10);
    Bid.find({price : { $gt: amount}})
        .then(bids => {
            res.json(bids);
        })
        .catch(err => {
            res.status(500).json({message: err.message});
        });
});

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

/**
 * @swagger
 * /bids/currency/{id}/{currency}:
 *  get:
 *      summary: Get bid info in another currency
 *      description: Get the amount bidded in another currency, given the product ID and the currency code.
 *      tags: [Bid]
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
 *                      $ref: '#/components/schemas/Bid'
 *
 */
router.get("/currency/:id/:currency", async (req, res) => {
    try {
        const id = req.params.id;
        const currency = req.params.currency;
        const bid = await Bid.findById(id).exec();

        if (bid) {
            const amount = bid.price;

            const amountInCurrency = await convertCurrency(amount, currency);

            res.json({
                user: bid.user,
                product: bid.product,
                price: amountInCurrency
            });
        } else {
            res.json({ message: 'Bid not found', type: 'danger' });
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

module.exports = router;