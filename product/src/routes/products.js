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
router.get("/", (req, res) =>{
    Product.find().exec((err, products) =>{
    if(err) {
        res.json({message: err.message});
    } else {
        res.json(products);
    }
    })
});

// Devuelve los productos a la venta de un usuario
/**
 * @swagger
 * /myProducts/{id}:
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
router.get("/myProducts/:id", (req, res) => {
    let id = req.params.id;
    Product.find({ user: id }, (err, products) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.json(products);
        }
    });
});

/**
 * @swagger
 * /products/finished/{finished}:
 *  get:
 *    summary: Products sold by user
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

router.get("/finished/:finished", (req, res) =>{
    Product.find({finished : req.params.finished}).exec((err, products) =>{
        if(err) {
            res.json({message: err.message});
        } else {
            res.json(products);
        }
    })
});

// Devuelve los productos cuya ultima puja sea mayor a una cantidad
router.get("/greaterThan/:amount", (req, res) =>{
    Product.find({lastBid : { $gt : req.params.amount}}).exec((err, products) =>{
        if(err) {
            res.json({message: err.message});
        } else {
            res.json(products);
        }
    })
});

// Devuelve los productos cuya ultima puja sea inferior a una cantidad
router.get("/lowerThan/:amount", (req, res) =>{
    Product.find({lastBid : { $lt : req.params.amount}}).exec((err, products) =>{
        if(err) {
            res.json({message: err.message});
        } else {
            res.json(products);
        }
    })
});

// Devuelve los productos publicados en las últimas :hours horas
router.get("/before/:hours", (req, res) => {
    const hours = parseFloat(req.params.hours);
    // Obtener la fecha actual menos n horas
    const currentDateMinusNHours = new Date();
    currentDateMinusNHours.setMilliseconds(currentDateMinusNHours.getMilliseconds() - hours * 3600 * 1000);
    // Consulta para encontrar productos publicados antes de la fecha actual menos n horas
    Product.find({ publicationDate: { $gte: currentDateMinusNHours, $lte: new Date() } }).exec((err, products) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.json(products);
        }
    });
});

/**
 * @swagger
 * /products/add:
 *   put:
 *     summary: Añade un nuevo producto
 *     description: Añade un nuevo producto a la base de datos.
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

router.put("/add", function (req, res) {
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

    product.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            res.json(product);
        }
    });
});

module.exports = router;