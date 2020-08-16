const print = require("./error_controller").log;

module.exports.home = function (req, res) {
  print("At home controller", "success");
  return res.render("home", { title: "home" });
};
