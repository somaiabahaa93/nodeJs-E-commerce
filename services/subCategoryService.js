const SubCategoryModel = require("../models/subCategoryModel");
const factory = require("../utils/handlerFactory");

// for nested routes
exports.setParametersToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  // eslint-disable-next-line no-const-assign
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
  }
  next();
};

exports.getsubCategories = factory.getAll(SubCategoryModel);

exports.getSbuCategory = factory.getOne(SubCategoryModel);

exports.createSubCategory = factory.createOne(SubCategoryModel);

exports.updateSubCategory = factory.updateOne(SubCategoryModel);

exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);
