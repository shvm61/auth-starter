const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/user_controller");

router.get("/sign-up", userController.signUp);
router.post("/create-acc", userController.createAccount);
router.get("/log-in", userController.signIn);
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/log-in" }),
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

module.exports = router;
