const bcrypt = require("bcrypt");

const Users = require("../models/user");
const print = require("./error_controller");
const mailer = require("../mailers/mail");
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

  return res.redirect("/users/log-in");
};
