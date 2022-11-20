const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2")
    .isLength({ max: 32 })
    .withMessage("max length is 32 char")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];
