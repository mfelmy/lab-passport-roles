require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash"); // MANAGES ERRORS DURING LOGIN PROCESS

mongoose
  .connect("mongodb://localhost/lab-passport-roles", { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`);

const app = express();

// MIDDLEWARE SETUP, INDICATED BY app.use()
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// EXPRESS VIEW ENGIN SETUP
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// VALUE FOR TITLE, THAT IS ACCESSIBLE IN THE VIEW DUE TO app.locals
app.locals.title = "Irongenerate Template with comments";

// ENABLE AUTHENTICATION USING PASSPORT & SESSION AND FLASH FOR ERROR HANDLING
app.use(
  session({
    secret: "irongenerator",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());
require("./passport")(app);

// A FEW HANDLEBARS HELPER EXAMPLES TO EXTEND THE POSSIBILITIES (CONDITIONS, VARIABLES) IN THE VIEW
hbs.registerHelper("ifUndefined", (value, options) => {
  if (arguments.length < 2) throw new Error("Handlebars Helper needs ONE parameter");

  let fnTrue = options.inverse;
  let fnFalse = options.fn;

  return typeof value !== undefined ? fnTrue(this) : fnFalse(this);
});
hbs.registerHelper("isSmallerThanSeven", (value, options) => {
  let fnTrue = options.fn;
  let fnFalse = options.inverse;

  return value < 7 ? fnTrue(this) : fnFalse(this);
});
app.use((req, res, next) => {
  // !! converts: truthy into true; falsy into false
  res.locals.isConnected = !!req.user;
  res.locals.isNotConnected = !!!req.user;

  hbs.registerHelper("isCurrentUser", function(value, options) {
    let fnTrue = options.fn;
    let fnFalse = options.inverse;

    return value === req.user.username ? fnTrue(this) : fnFalse(this);
  });

  next();
});

// MOUNTPOINT FOR THE ROUTES: if URL is "/..." look for routes in "./routes/..."
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/private", require("./routes/private"));

module.exports = app;
