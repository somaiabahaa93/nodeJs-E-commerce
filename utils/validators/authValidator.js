const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.signUpValidator = [
  check("name")
    .notEmpty()
    .withMessage("user name is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("this is not valid email")
    .custom((val, { req }) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("this email already used", 401));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("too short password")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("password must match confirm password");
      }
      return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage(" confirm password is required"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("this is not valid email"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("too short password"),

  validatorMiddleware,
];
