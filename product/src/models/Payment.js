const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    user: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: String
    }

}, {collection: 'Payment', versionKey: false });
module.exports = mongoose.model("Payment", productSchema);
