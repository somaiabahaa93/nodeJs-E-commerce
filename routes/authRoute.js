const express = require("express");

const router = express.Router();
const {
  signUpValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const { signUp, login } = require("../services/authService");

router
  .route("/signup")
  // .get(getUserValidator, getUsers)
  .post(signUpValidator, signUp);
router
  .route("/login")
  // .get(getUserValidator, getUsers)
  .post(loginValidator, login);
module.exports = router;
