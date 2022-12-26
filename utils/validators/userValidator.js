const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const bcrypt = require("bcrypt");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const UserModel = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
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
          return Promise.reject(new Error("this email already used", 404));
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
  check("profileImg").optional(),
  check("role").optional(),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("not accepted phone number"),

  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("this is not valid email")
    .custom((val, { req }) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("this email already used", 404));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("not accepted phone number"),
  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("cuurnt password is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password is required"),
  check("password")
    .notEmpty()
    .withMessage("cuurnt password is required")
    .custom(async (val, { req }) => {
      // 1-verify current password
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return new Error("user not found");
      }
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) {
        throw new Error("current password not correct");
      }
      // 2-verify password confirm
      if (val !== req.body.confirmPassword) {
        throw new Error("current password not match confirm password");
      }
      // return true;
    }),
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("this is not valid email")
    .custom((val, { req }) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("this email already used", 404));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("not accepted phone number"),
  validatorMiddleware,
];
