const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:{
    type: String,
        required: true,
    },
    description:{
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    startingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    lastBid: {
        type: Number,
        required: true,
        default: 0.0
    },
    latitude: {
        type: String,
        required: true
    },
    longitude:{
        type: String,
        required: true
    },
    publicationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endingDate: {
        type: Date,
        required: true,
    },
    finished: {
        type: Boolean,
        required: true,
        default: false
    },
    imageId: {
        type: String,
    },
    payed: {
        type: Boolean,
        default: false
    },

}, {collection: 'Product', versionKey: false });
module.exports = mongoose.model("Product", productSchema);
