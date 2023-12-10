const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
    {
        text: {
            type: String,
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        users: Array,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        date: {
            type: Date,
            default: Date.now, // Establece la fecha actual como valor predeterminado
        }
    },{collection: 'Message', versionKey: false});

module.exports = mongoose.model("Messages", MessageSchema);
