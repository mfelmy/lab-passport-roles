const express = require("express");
const User = require("../models/User");

const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});


module.exports = router;