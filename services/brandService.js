const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brandModel");
const factory = require("../utils/handlerFactory");
const { uploadSingleImage } = require("../middelwares/uploadeImageMiddleware");

// middleware for images
exports.uploadeBrandImage = uploadSingleImage("image");

// resize images using sharp (processing)
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc   get all brands
// route  GET /api/v1/brands
exports.getBrands = factory.getAll(BrandModel);

exports.getBrand = factory.getOne(BrandModel);

exports.updateBrand = factory.updateOne(BrandModel);

exports.deleteBrand = factory.deleteOne(BrandModel);

exports.createBrand = factory.createOne(BrandModel);
// module.exports=getCategories,createCategory
