const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user_controller");

router.get("/sign-up", userController.signUp);
router.post("/create-acc", userController.createAccount);
router.get("/sign-in", userController.signIn);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  userController.createSession
);
router.get("/sign-out", userController.signOut);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/log-in" }),
  userController.createSession
);

router.get("/reset-password", userController.resetPassword);
router.post("/reset-link", userController.sendResetMail);
router.get("/change-password", userController.changePasswordPage);
router.post("/final-password-change", userController.finalPasswordChange);
module.exports = router;
