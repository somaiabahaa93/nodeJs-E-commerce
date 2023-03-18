const express = require("express");

const router = express.Router();
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const {
  signUp,
  login,
  forgetPassword,
  verifyResetCode,
  verifyResetPassword,
  frontEndSignUp,
  frontEndlLogin,
} = require("../services/authService");

router
  .route("/signup")
  // .get(getUserValidator, getUsers)
  .post(signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgetpassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/verifyResetPassword", verifyResetPassword);

// frontEndProject
router
  .route("/frontEndSignup")
  // .get(getUserValidator, getUsers)
  .post(frontEndSignUp);
router.post("/frontEndLogin", frontEndlLogin);

module.exports = router;
