const { check } = require("express-validator");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title  is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2")
    .isLength({ max: 32 })
    .withMessage("max length is 32 char"),
  check("description")
    .notEmpty()
    .withMessage("product dec  is required")
    .isLength({ min: 20 })
    .withMessage("min length is 20")
    .isLength({ max: 2000 })
    .withMessage("max length is 2000 char"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity  is required")
    .isNumeric()
    .withMessage("quantity must be number"),
  check("sold").optional().isNumeric().withMessage("sold must be number"),
  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price must be number")
    .isLength({ max: 32 })
    .withMessage("max price length is 20"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("price must be number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be < price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors should be array of strings"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("coverImage").notEmpty().withMessage("coverImage   is required"),
  check("category")
    .notEmpty()
    .withMessage("category   is required")
    .isMongoId()
    .withMessage("it is invalid id"),
  check("sub").optional().isMongoId().withMessage("it is invalid id"),
  check("brand").optional().isMongoId().withMessage("it is invalid id"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be number")
    .isLength({ max: 32 })
    .withMessage("max rating  is 5")
    .isLength({ min: 1 })
    .withMessage("min rating  is 1"),
  check("ratingQuantitiy")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantitiy must be number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];
