const express = require("express");
const User = require("../models/User");
const { isConnected, checkRole } = require("../middlewares");

const router = express.Router();

// ALLOW ALL USERS TO VIEW OTHER USERS AND THEIR DETAILS
router.get("/users", isConnected, (req, res, next) => {
  User.find()
    .then(user => {
      res.render("users/all-users", { user });
    })
    .catch(next);
});
router.get("/users/:id", isConnected, (req, res, next) => {
  User.findById(req.params.id)
    .then(user => {
			// console.log("TCL: user", user);
      res.render("users/user-page", { user });
    })
    .catch(next);
});

// ALL USERS TO EDIT THEIR OWN PROFLE
// router.get('/edit-student/:studentId', (req,res,next) => {
//   Promise.all([
//     Campus.find(),
//     Student.findById(req.params.studentId)
//   ])
//     .then(([campuses,student]) => {
//       res.render('edit-student', {student, campuses})
//     })
// })

// router.post('/edit-student/:studentId', (req,res,next) => {
//   let { firstName, lastName, _campus } = req.body
//   Student.findByIdAndUpdate(req.params.studentId, {
//     firstName, 
//     lastName,
//     _campus
//   })
//     .then(() => {
//       res.redirect('/students')
//     })
// })

module.exports = router;
