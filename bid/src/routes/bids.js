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
 *              product: 5f9d88b9c4b9e3b3f4f3f4f3
 *              user: 5f9d88b9c4b9e3b3f4f3r4f3
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
router.get("/bids", (req, res) => {
    Bid.find().exec((err, bids) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.json(bids);
        }
    })
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
router.get("/bids/before/:hours", (req, res) => {
    const hours = parseFloat(req.params.hours);
    // Obtener la fecha actual menos n horas
    const currentDateMinusNHours = new Date();
    currentDateMinusNHours.setMilliseconds(currentDateMinusNHours.getMilliseconds() - hours * 3600 * 1000);
    Bid.find({ date: { $gte: currentDateMinusNHours, $lte: new Date() } }).exec((err, bids) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.json(bids);
        }
    });
});

module.exports = router;