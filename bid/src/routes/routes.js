var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Bid = require('../models/Bid');
const Product = require('../models/Product');
var bodyParser = require('body-parser');

//const multer = require('multer');

router.get("/", (req, res) =>{
  res.render("index", {title: "El Rastro"})
} );


module.exports = router;
