const bcrypt = require("bcrypt");
const crypto = require("crypto");
const queue = require("../config/kue");
const Users = require("../models/user");
const ResetPassword = require("../models/reset_password");
const print = require("./error_controller");
const mailer = require("../mailers/mail");
const User = require("../models/user");

const saltRounds = 10;

module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("sign_up", { title: "Sign-UP" });
};
module.exports.createAccount = async function (req, res) {
  try {
    let hash = await bcrypt.hash(req.body.password, saltRounds);
    // req.password = hash;

    await Users.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    return res.redirect("/");
  } catch (error) {
    return print("Error in signup", "error", error);
  }
};

module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  return res.render("sign_in");
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Successfully Logged in");
  mailer.newMail(req.user);
  return res.redirect("/");
};
module.exports.signOut = function (req, res) {
  req.logout();
  req.flash("success", "Successfully Logged OUT");

  return res.redirect("/users/sign-in");
};
module.exports.resetPassword = function (req, res) {
  if (req.isAuthenticated()) return res.redirect("/");
  return res.render("reset_password");
};

module.exports.sendResetMail = async function (req, res) {
  try {
    console.log(req.body);
    let token = crypto.randomBytes(20).toString("hex");
    let user = await ResetPassword.create({
      email: req.body.email,
      token: token,
    });
    console.log(user);
    mailer.sendResetLink(user);
    return res.redirect("/");
  } catch (error) {
    console.log("error ", error);
  }
};

module.exports.changePasswordPage = function (req, res) {
  console.log(req.query.token);
  return res.render("change_password", { token: req.query.token });
};

module.exports.finalPasswordChange = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      let user = await Users.findById(req.user.id);
      let hash = await bcrypt.hash(req.body.password, saltRounds);
      user.password = hash;
      user.save();
      return res.redirect("/");
    }
    let tempUser = await ResetPassword.findOne({ token: req.query.token });
    if (!tempUser.isValid) return res.redirect("/");
    let user = await Users.findOne({ email: tempUser.email });
    let hash = await bcrypt.hash(req.body.password, saltRounds);
    user.password = hash;
    tempUser.isValid = false;
    user.save();
    tempUser.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
