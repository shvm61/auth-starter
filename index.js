const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;
require("dotenv").config();
const db = require("./config/mongoose");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const flash_middleware = require("./config/flash_middleware");

app.use(morgan("dev"));

app.use(express.static("./assets"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(
  session({
    name: "codeial",
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(flash_middleware.setFlash);

app.use("/", require("./routes"));

app.listen(PORT, function (err) {
  if (err) console.error(__filename, err);
  console.log(`Running on Port ${PORT}`);
});
