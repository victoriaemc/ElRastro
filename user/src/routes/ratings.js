const express = require('express');
const router = express.Router();
//const User = require('../models/User');
//const Bid = require('../models/Bid');
//const Product = require('../models/Product');
const Rating = require('../models/Rating');
//const bodyParser = require('body-parser');
//const axios = require('axios');

// GET ALL RATINGS
router.get('/ratings', async (req, res) => {
    Rating.find()
        .then(ratings => res.json(ratings))
        .catch(err => res.json({message: err.message}));
});


// GET ALL RATINGS FOR AN USER (FOR PROFILE PAGE)
// You also get average rating of the user
// localhost:8000/users/ratings?user=654926ac75aa4e12761f4ab9
router.get('/ratings', async (req, res) => {
    try {
        let userId = req.query.user;

        if (!userId) {
            return res.status(400).json({ message: "Missing 'ratings' parameter. Please provide a valid user ID." });
        }

        const ratings = await Rating.find({ user: userId }).exec();

        if (ratings.length === 0) {
            return res.json({ message: "No ratings found for the specified user." });
        }

        // Calculate the average rating
        const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const averageRating = totalRating / ratings.length;
        // Use toFixed to round the average rating to 2 decimal places
        const roundedAverageRating = parseFloat(averageRating.toFixed(2));

        res.json({
            ratings: ratings,
            averageRating: roundedAverageRating
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE NEW RATING FOR A USER
router.post('/:userId/ratings', async (req, res) => {
    const rating = new Rating({
        product: req.body.product,
        user: req.params.userId,
        rater: req.body.rater,
        rating: req.body.rating
    });
    try {
        const savedRating = await rating.save();
        res.json(savedRating);
    } catch (err) {
        res.json({ message: err });
    }
});

// DELETE A RATING (FROM A USER)
router.delete('/:userId/ratings/:ratingId', async (req, res) => {
    let userId = req.params.userId;
    let ratingId = req.params.ratingId;
    Rating.findByIdAndDelete(ratingId)
        .then(() => res.json({message: "Rating deleted"}))
        .catch(err => res.json({message: err.message}));
});

// UPDATE A RATING (FROM A USER)
router.patch('/:userId/ratings/:ratingId', async (req, res) => {
    try {
        const updatedRating = await Rating.updateOne(
            {_id: req.params.ratingId},
            {$set: {rating: req.body.rating}}
        );
        res.json(updatedRating);
    } catch (err) {
        res.json({ message: err });
    }
});

module.exports = router;