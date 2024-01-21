const express = require("express");
const User = require("../models/userModel");
const passport = require("passport");
const localStrategy = require("passport-local");
const upload = require("./multer");
const postModel = require("../models/postModel");

const router = express.Router();

passport.use(new localStrategy(User.authenticate()));

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/profile", isLoggedIn, async (req, res) => {
  const user = await User.findOne({
    username: req.session.passport.user,
  }).populate("posts");
  res.render("profile", { user });
});

router.post("/register", async (req, res) => {
  try {
    const createdUser = new User({
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
    });

    await User.register(createdUser, req.body.password);

    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.render("error", {
      error: "Error during registration. Please try again.",
    });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

router.post(
  "/fileupload",
  isLoggedIn,
  upload.single("image"),
  async (req, res, next) => {
    const user = await User.findOne({
      username: req.session.passport.user,
    });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

router.get("/add", isLoggedIn, async (req, res, next) => {
  res.render("add");
});

router.post(
  "/createpost",
  isLoggedIn,
  upload.single("postImage"),
  async (req, res, next) => {
    const user = await User.findOne({
      username: req.session.passport.user,
    });
    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  }
);

router.get("/show/posts", isLoggedIn, async (req, res, next) => {
  const user = await User.findOne({
    username: req.session.passport.user,
  }).populate("posts");
  res.render("show", { user });
});

router.get("/feed", isLoggedIn, async (req, res, next) => {
  const user = await User.findOne({
    username: req.session.passport.user,
  });
  const posts = await postModel.find().populate("user");
  res.render("feed", { user, posts });
});

module.exports = router;
