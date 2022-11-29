const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2")
    .isLength({ max: 32 })
    .withMessage("max length is 32 char")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  // check("image").notEmpty().withMessage("image is required"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];
