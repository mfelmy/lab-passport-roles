const express = require("express");
const router = express.Router();
const { isConnected, checkRole } = require("../middlewares");

router.get("/secret", isConnected, (req, res, next) => {
  let user = req.user;
  console.log("TCL: user", user);
  res.render("private/secret", { user });
});

module.exports = router;
