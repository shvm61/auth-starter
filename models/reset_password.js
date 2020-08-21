const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = ResetPassword;
