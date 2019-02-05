const express = require("express");
const passport = require('passport');
const User = require("../models/User");
const { isConnected, checkRole } = require("../middlewares");

const router = express.Router();

// Bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const bcryptSalt = 10;

// LOGIN
router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

// SIGNUP
router.get("/signup", checkRole("Boss"), (req, res, next) => {
  res.render("auth/signup");
});
router.post("/signup", checkRole("Boss"), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
      role
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
