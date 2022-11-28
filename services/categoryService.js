/* eslint-disable no-undef */
const multer = require("multer");
const asyncHandler = require("express-async-handler");

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/ApiError");
const factory = require("../utils/handlerFactory");

// 1-diskStorage
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

// 2-memory Storage if needed to make proccessing
const multerStorage = multer.memoryStorage();
// filter files to images only
multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// middleware for images
exports.uploadeCategoryImage = upload.single("image");

// resize images using sharp
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
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
