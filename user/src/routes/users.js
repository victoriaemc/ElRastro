var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Bid = require('../models/Bid');
const Product = require('../models/Product');
//const Rating = require('../models/Rating');
var bodyParser = require('body-parser');
const axios = require('axios');
const jwt = require('jsonwebtoken');

router.get("/userLocation", async (req, res) => {
    try {
        const apiUrl = 'https://ipgeolocation.abstractapi.com/v1/?api_key=cb808f11678847c4963ae38b582c4345';
        const response = await axios.get(apiUrl);
        const jsonData = response.data;

        res.json(jsonData);
    } catch (error) {
        console.error('Error al obtener datos de la API:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Devuelve los usuarios que han pujado en un producto
// localhost:8000/users/bidders?productId=6549293875aa4e12761f4ac5
router.get("/bidders", async (req, res) => {
    try {
        const productId = req.query.productId;

        if (productId) {
            // Case 1: If product ID is specified, get bidders for that product
            const bids = await Bid.find({ product: productId }).populate('user').exec();
            const usersWhoBidded = bids.map(bid => bid.user);
            res.json(usersWhoBidded);
        } else {
            // Case 2: If no product ID specified, get all users who have bid
            const users = await Bid.aggregate([
                { $group: { _id: "$user" } }
            ]);

            if (users.length > 0) {
                const userIds = users.map(user => mongoose.Types.ObjectId(user._id));
                const usersDetails = await User.find({ _id: { $in: userIds } });
                res.json(usersDetails);
            } else {
                res.status(404).json({ message: "No users found who have placed bids" });
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Users who have ever sold a product
router.get("/sellers", async (req, res) => {
    try {
        const sellers = await Product.aggregate([
            {
                $lookup: {
                    from: 'User', // Collection name of the User model
                    localField: 'user',
                    foreignField: '_id',
                    as: 'sellerDetails'
                }
            },
            {
                $unwind: '$sellerDetails'
            },
            {
                $group: {
                    _id: '$sellerDetails._id',
                    username: { $first: '$sellerDetails.username' },
                    email: { $first: '$sellerDetails.email' }
                }
            }
        ]);

        res.json(sellers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login google
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID_VICKY;
router.post ('/login', async (req, res) => {
    const {token} = req.body;
    try{
        const decodedToken = jwt.verify(token, googleClientId);
        console.log("Decoded Token:", decodedToken);
        // TODO guardar usuario en DB
        // Respond with a success message
        res.json({ success: true, message: "Login successful" });
    }catch (e) {
        console.error("Verification error", e)
        res.status(401).json({ success: false, message: "Token verification failed" });
    }

});



/* GET users listing. */
// localhost:8000/users -> Devuelve todos los usuarios
// localhost:8000/users?name= -> Devuelve todos los usuarios que contengan el nombre especificado
// localhost:8000/users?email= -> Devuelve todos los usuarios que contengan el email especificado
router.get("/", (req, res) => {
    try{
        const nameInput = req.query.name;
        const emailInput = req.query.email;
        if(nameInput){
            User.find({name: {$regex: new RegExp(nameInput, 'i')}})
                .then(users => res.json(users))
                .catch(err => res.json({message: err.message}));
        }else if(emailInput){
            User.find({email: {$regex: new RegExp(emailInput, 'i')}})
                .then(users => res.json(users))
                .catch(err => res.json({message: err.message}));
    }else{
        User.find()
            .then(users => res.json(users))
            .catch(err => res.json({message: err.message}));
    }}
    catch (err){
        res.status(500).json({ message: err.message });
    }
});

// Check email validity for user adding
async function checkEmail(email) {
    const response = await fetch(`https://www.disify.com/api/email/${email}`);

    if (response.ok){
        const data = await response.json();

        if (data.hasOwnProperty('format')){
            return data.format; // true or false
        }else{
            console.log('Error: ${data.message}');
            return null;
        }
    }else{
        console.log('Error: ${response.status}');
        return null;
    }
}

/* Add users */
router.post('/', bodyParser.json(), async (req, res) => {
    try {
        const email = req.body.email;

        // Verifica si el correo tiene el formato correcto utilizando la función checkEmail
        const isValidEmail = await checkEmail(email);

        if (isValidEmail === true) {
            const user = new User({
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                email: email,
                propicId: req.body.propicId,
            });

            await user.save();
            res.redirect('/users');
        } else {
            res.json({ message: 'Invalid email format', type: 'danger' });
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Get an user by id
router.get("/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Editar un usuario
router.put("/:id", bodyParser.json(), async (req, res) => {
    try {
        const id = req.params.id;
        const update = req.body; // Assuming the request body contains the updated user data

        if (update.email) {
            const isValidEmail = await checkEmail(update.email);

            if (!isValidEmail) {
                return res.status(400).json({ message: "Invalid email format", type: "danger" });
            }
        }

        // If the email is valid or not present in the update, proceed with user update
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
router.delete("/:id",bodyParser.json(), (req, res)=>{
    let id = req.params.id;
    User.findByIdAndDelete(id)
        .then(() =>{
                res.json({ message: "User deleted" });
        })
        .catch(err => res.json({ message: err.message }));
    });

module.exports = router;