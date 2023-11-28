const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        enum: [0, 0.5, 1, 1.5, 2, 2.5, 3 ,3.5, 4, 4.5, 5],
        default: 0.0
    }

}, {collection: 'Rating', versionKey: false});

module.exports = mongoose.model("Rating", ratingSchema);