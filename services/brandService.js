const BrandModel = require("../models/brandModel");
const factory = require("../utils/handlerFactory");

// @desc   get all brands
// route  GET /api/v1/brands
exports.getBrands = factory.getAll(BrandModel);

exports.getBrand = factory.getOne(BrandModel);

exports.updateBrand = factory.updateOne(BrandModel);

exports.deleteBrand = factory.deleteOne(BrandModel);

exports.createBrand = factory.createOne(BrandModel);
// module.exports=getCategories,createCategory
