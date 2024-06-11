const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title  is required")
    .isLength({ min: 2 })
    .withMessage("min length is 2")
    .isLength({ max: 200 })
    .withMessage("max length is 32 char")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
    .isLength({ max: 20000 })
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
  check("imageCover").notEmpty().withMessage("ImageCover   is required"),
  check("category")
    .notEmpty()
    .withMessage("category   is required")
    .isMongoId()
    .withMessage("it is invalid id")
    .custom((cat) =>
      CategoryModel.findById(cat).then((catValue) => {
        if (!catValue) {
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject("No Category found for this id");
        }
      })
    ),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("it is invalid id")
    .custom((subcategoriesIds) =>
      subCategoryModel
        .find({ _id: { $exists: true, $in: subcategoriesIds } })
        .then((result) => {
          if (result < 1 || result.length < subcategoriesIds.length) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject("No subCategories found for this ids");
          }
          // console.log("res", result);
        })
    )
    .custom((val, { req }) =>
      subCategoryModel
        .find({ category: req.body.category })
        .then((subCatInDb) => {
          const subIdsInDb = [];
          subCatInDb.forEach((subCat) => {
            subIdsInDb.push(subCat._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subIdsInDb)) {
            return Promise.reject(
              new Error("subCategories dont belong to this category")
            );
          }
        })
    ),
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
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];
