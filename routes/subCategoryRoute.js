const express = require("express");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// merge params allow us to access params on other routes
// ex we need to access categoryId from category router
const router = express.Router({ mergeParams: true });
const {
  createSubCategory,
  getsubCategories,
  getSbuCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../services/subCategoryService");

router
  .route("/")
  .post(createSubCategoryValidator, createSubCategory)
  .get(getsubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSbuCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
