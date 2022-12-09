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
  setParametersToBody,
  createFilterObject,
} = require("../services/subCategoryService");
const authService = require("../services/authService");

router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setParametersToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getsubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSbuCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
