const mongoose = require('mongoose');
const bidSchema = new mongoose.Schema({
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
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }

}, {collection: 'Bid'});

module.exports = mongoose.model("Bid", bidSchema);
