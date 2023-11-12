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
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
 */
router.get("/", (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.json({message: err.message}));
});


// Get an user by id
/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Get user by id
 *      description: Get user that matches the id
 *      tags: [User]
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
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *
 */
router.get("/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(bid => {
            if (bid) {
                res.json(bid);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});



/* Add users */
router.get("/add", (req, res) =>{
    res.render("add_users", {title: "Add Users"});
});

/**
 * @swagger
 * /users/add:
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
 *      200:
 *          description: Created
 */
router.post('/add', bodyParser.json(), async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            username: req.body.username,
            password: req.body.password
        });

        console.log(req.body.username + " Este es el body " + req.body.name);

        await user.save();
        res.redirect('/users');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Editar un usuario
/**
 * @swagger
 * /users/{id}:
 *  put:
 *      summary: Update user
 *      description: Update an user
 *      tags: [User]
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
 *                  $ref: '#/components/schemas/User'
 *      responses:
 *          200:
 *              description: Success
 *
 */
router.put("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const update = req.body; // Assuming the request body contains the updated user data

        // `new: true` option returns the modified document rather than the original
        const updatedUser = await User.findOneAndUpdate({ _id: id }, update, { new: true });

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Borrar un usuario
/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    summary: Delete user
 *    description: Delete a user
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      302:
 *          description: Success
 *
 */
router.delete("/:id",bodyParser.json(), (req, res)=>{
    let id = req.params.id;
    User.findByIdAndDelete(id)
        .then(() => res.json({ message: "User deleted" }))
        .catch(err => res.json({ message: err.message }));
    });


// Devuelve los usuarios que han pujado en un producto
// TODO: Completar cuando se arreglen las rotues de products
/**
 * @swagger
 * /users/bidders/{id}:
 *  get:
 *    summary: Bidders for a product
 *    description: Get all users who have bid on a product, given the product's id
 *    tags: [User]
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
 *                          $ref: '#/components/schemas/User'
 */
router.get("/bidders/:id", async (req, res) => {
    try {
        let productId = req.params.id;
        const bids = await Bid.find({ product: productId }).populate('user').exec();
        const usersWhoBidded = bids.map(bid => bid.user);
        res.json(usersWhoBidded);
    } catch (err) {
        res.json({ message: err.message });
    }
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
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
 */

router.get("/bidders", async (req, res) => {
    try {
        const users = await Bid.aggregate([
            { $group: { _id: "$user" } }
        ]);
        console.log(users)
        if (users.length > 0) {
            const userIds = users.map(user => mongoose.Types.ObjectId(user._id));

            const usersDetails = await User.find({ _id: { $in: userIds } });

            res.json(usersDetails);
        } else {
            res.status(404).json({ message: "No users found who have placed bids" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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
 *          content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/User'
 */
router.get("/users/sellers", (req, res) => {
    Product.distinct('user')
        .populate('user', 'username email') // Populate para obtener los datos de usuario de cada producto
        .exec()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
})

// GET users by name
/**
 * @swagger
 * /users/name/{name}:
 *  get:
 *    summary: Users by name
 *    description: Get all users whos names match with the name/chain given
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: name
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
 *                          $ref: '#/components/schemas/User'
 */
router.get("/name/:name", (req, res) => {
    User.find({name: {$regex: new RegExp(req.params.name, 'i')}})
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
})
module.exports = router;