const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/ApiError");
// eslint-disable-next-line import/no-unresolved
const factory = require("../utils/handlerFactory");
const {
  uploadMultipleImages,
} = require("../middelwares/uploadeImageMiddleware");

// upload images
exports.uploadProductImages = uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

//   resize images
exports.resizeImages = asyncHandler(async (req, res, next) => {
  console.log("req", req.files);
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    // if (req.file) {
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1330)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverName}`);
    req.body.imageCover = imageCoverName;
    // }
  }
  if (req.files.images) {
    req.body.images = [];
    req.files.images.map(async (image, index) => {
      const imagename = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
      // if (req.file) {
      await sharp(image.buffer)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${imagename}`);
      req.body.images.push(imagename);
      // }
    });
  }
  next();
});
// @desc   get all products
// route  GET /api/v1/products
exports.getProducts = factory.getAll(ProductModel, "Products");

exports.getProduct = factory.getOne(ProductModel, "reviews");

exports.createProduct = factory.createOne(ProductModel);

exports.updateProduct = factory.updateOne(ProductModel);

exports.deleteProduct = factory.deleteOne(ProductModel);

// module.exports=getCategories,createCategory
