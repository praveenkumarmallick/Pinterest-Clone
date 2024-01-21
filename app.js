const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const router = require("./router/router");
const User = require("./models/userModel");
const Post = require("./models/postModel");
const expressSession = require("express-session");
const passport = require("passport");

const app = express();

// Middlewares
app.set("view engine", "ejs");

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "Hello, There!",
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);
app.use("/", User);
app.use("/", Post);

app.listen(4040, () => {
  console.log("Server is running on http://localhost:4040");
});
