// EVERY ROUTES FILE MUST END WITH module.exports = router;
const express = require("express");
const router = express.Router();

// GET METHODS
/* 
  - everytime we navigate to an URL, we make a GET request to the server, thereby we can send data with two kind of techniques
    - route params (allow to get params from the URL, usually used to define request)
    - query params (allow to send params on the URL, usually used for search/filter)

  - ROUTE PARAMS
    - set: "/:key" --> "/value"
    - get: req.params
    - html: null

  - QUERY PARAMS
    - set: "/search?key=value"
    - get: req.query
    - html:
      <form action="/search" method="GET">
        <label for="key">Label name</label>
        <input type="text" name="key" value="value">

        <button type="submit">SEARCH</button>
      </form>

  - PROS: can be shared/stored
  - CONS: limited
*/

// POST METHODS
/* 
  - for sending data to create or update resources on the server (not just search/filter db), and to prevent the information form being shown/stored in the URL and browsing history
  
  - WORKFLOw
    - show user form
    - user enters data and submits
    - form does POST request
    - user is redirected


  - QUERY PARAMS
    - get: data isn't readable by default, we need bodyParser
      --> req.body
    <form action="/login" method="POST">
      <label for="username">Username</label>
      <input type="text" name="username">
      
      <label for="password">Password</label>
      <input type="password" name="password">
      
      <button type="submit">LOGIN</button>
    </form>

  - PROS: "unlimited" amount of data included in the body of the form
  - CONS: cannot be shared/sored
*/

// HOME PAGE
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
