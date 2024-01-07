const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:    true,
    },
    username:{
        type: String,
        required: false,
    },
    password:{
        type: String,
        required: false,
    },
    email:{
        type: String,
        required: true,
    },
    propicId:{
        type: String,
        required: false,
    },
    googleId:{
        type: String,
        required: true,
    }
}, {collection: 'User', versionKey: false});
module.exports = mongoose.model("User", userSchema);