/* eslint-disable no-undef */
const asyncHandler = require("express-async-handler");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const CategoryModel = require("../models/categoryModel");
const factory = require("../utils/handlerFactory");
const { uploadSingleImage } = require("../middelwares/uploadeImageMiddleware");

// middleware for images
exports.uploadeCategoryImage = uploadSingleImage("image");

// resize images using sharp (processing)
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  // if (req.file) {
  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  // }
  next();
});

// @desc   get all categories
// route  GET /api/v1/categories
exports.getCategories = factory.getAll(CategoryModel);

exports.getCategory = factory.getOne(CategoryModel);

exports.updateCategory = factory.updateOne(CategoryModel);

exports.deleteCategory = factory.deleteOne(CategoryModel);

exports.createCategory = factory.createOne(CategoryModel);
// module.exports=getCategories,createCategory
