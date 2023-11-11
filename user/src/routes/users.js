var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Bid = require('../models/Bid');
const Product = require('../models/Product');
var bodyParser = require('body-parser');

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of the user
 *              username:
 *                  type: string
 *                  description: Username of the user
 *              password:
 *                  type: string
 *                  description: Password of the user
 *              email:
 *                  type: string
 *                  description: Email of the user
 *          required:
 *              - name
 *              - username
 *              - password
 *              - email
 *          example:
 *              name: Maria
 *              username: mariafdz
 *              password: 1234insecurepwd
 *              email: mariamail@gmail.com
 *
 */

/* GET users listing. */
/**
 * @swagger
 * /users:
 *  get:
 *    summary: Get all users
 *    description: Get all users
 *    tags: [User]
 *    responses:
 *      200:
 *          description: Success
 */
router.get("/users", (req, res) => {
    User.find().exec((err, users) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.json(users);
        }
    })
});

/* Add users */
router.get("/add", (req, res) =>{
    res.render("add_users", {title: "Add Users"});
});

/**
 * @swagger
 * /add:
 *  post:
 *    summary: Add user
 *    description: Add a new user
 *    tags: [User]
 *    requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    description: The user's name.
 *                    example: Leanne Graham
 *                  username:
 *                    type: string
 *                    description: The user's username.
 *                    example: lgraham
 *                  password:
 *                    type: string
 *                    description: The user's password.
 *                    example: badpassword123
 *    responses:
 *      201:
 *          description: Created
 */
router.post('/add', bodyParser.json(), (req, res) =>{
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });
    console.log(req.body.username + " Este es el body "+ req.body.name);
    user.save((err)=> {
        if(err){
            res.json({message: err.message, type: 'danger'});
        }else {
            req.session.message = {
                type: 'success',
                message: 'User added successfully!'
            };
            res.redirect('/users');
        }
    });
});

// Borrar un usuario
/**
 * @swagger
 * /delete:
 *  post:
 *    summary: Delete user
 *    description: Delete a user
 *    tags: [User]
 *    requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: The user's id.
 *                    example: 654c0bde1ff961575885e54d
 *    responses:
 *      200:
 *          description: Success
 *
 */
router.post("/delete",bodyParser.json(), (req, res)=>{
    console.log(req.body.Index);
    User.findByIdAndDelete(req.body.Index).then(function(){
        console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });

    res.redirect("/users");
    });

// Users who bid at least on one product
/**
 * @swagger
 * /users/bidders:
 *  get:
 *    summary: Bidder users
 *    description: Get all users who have bid at least on one product
 *    tags: [User]
 *    responses:
 *      200:
 *          description: Success
 */

// Devuelve los usuarios que han pujado en una subasta
router.get("/bidders/:id", (req, res) => {
    let productId = req.params.id;
    Bid.find({ product: productId })
        .populate('user') // Populate para obtener los datos de usuario de cada puja
        .exec((err, bids) => {
            if (err) {
                res.json({ message: err.message });
            } else {
                const usersWhoBidded = bids.map(bid => bid.user);
                res.json(usersWhoBidded);
            }
        });
});
// Devuelve los usuarios que han pujado alguna vez
/**
 * @swagger
 * /users/bidders:
 *  get:
 *    summary: Bidder users
 *    description: Get all users who have bid on at least one product
 *    tags: [User]
 *    responses:
 *      200:
 *          description: Success
 */

router.get("/users/bidders", (req, res) => {
    Bid.find()
        .populate('user') // Populate para obtener los datos de usuario de cada puja
        .exec((err, bids) => {
            if (err) {
                res.json({ message: err.message });
            } else {
                const usersWhoBidded = bids.map(bid => bid.user);
                res.json(usersWhoBidded.filter((user, index, array) => !array.slice(0, index).includes(user)));
            }
        });
});



// Users who have ever sold a product
/**
 * @swagger
 * /users/sellers:
 *  get:
 *    summary: Seller users
 *    description: Get all users who have sold at least one product
 *    tags: [User]
 *    responses:
 *      200:
 *          description: Success
 */
router.get("/users/sellers", (req, res) => {
    Product.find()
        .populate('user') // Populate para obtener los datos de usuario de cada producto
        .exec((err, products) => {
            if (err) {
                res.json({ message: err.message });
            } else {
                const usersWhoSold = products.map(product => product.user);
                res.json(usersWhoSold.filter((user, index, array) => !array.slice(0, index).includes(user)));
            }
        });
});
module.exports = router;