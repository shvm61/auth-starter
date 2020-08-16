let colors = require("colors");

colors.setTheme({
  info: "bgGreen",
  help: "cyan",
  warn: "yellow",
  success: "bgBlue",
  error: "red",
});

module.exports.log = function (message, status, error) {
  if (status === "success") console.log(message.success);
  if (status === "error") console.log(message.error, error.error);

  return;
};
