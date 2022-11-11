const { check } = require("express-validator");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subcategory is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2")
    .isLength({ max: 32 })
    .withMessage("max length is 32 char"),
  check("category")
    .notEmpty()
    .withMessage("main Category id must exist")
    .isMongoId()
    .withMessage("id is not valid id"),
  validatorMiddleware,
];

exports.getSubCategoryValidator = [
  check("id").notEmpty().isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];
