const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:    true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: false,
    }
}, {collection: 'User', versionKey: false});
module.exports = mongoose.model("User", userSchema);