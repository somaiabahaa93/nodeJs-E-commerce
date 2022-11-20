const ProductModel = require("../models/productModel");
// eslint-disable-next-line import/no-unresolved
const factory = require("../utils/handlerFactory");

// @desc   get all products
// route  GET /api/v1/products
exports.getProducts = factory.getAll(ProductModel, "Products");

exports.getProduct = factory.getOne(ProductModel);

exports.createProduct = factory.createOne(ProductModel);

exports.updateProduct = factory.updateOne(ProductModel);

exports.deleteProduct = factory.deleteOne(ProductModel);

// module.exports=getCategories,createCategory
