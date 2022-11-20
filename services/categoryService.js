const CategoryModel = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");

// @desc   get all categories
// route  GET /api/v1/categories
exports.getCategories = factory.getAll(CategoryModel);

exports.getCategory = factory.getOne(CategoryModel);

exports.updateCategory = factory.updateOne(CategoryModel);

exports.deleteCategory = factory.deleteOne(CategoryModel);

exports.createCategory = factory.createOne(CategoryModel);
// module.exports=getCategories,createCategory
