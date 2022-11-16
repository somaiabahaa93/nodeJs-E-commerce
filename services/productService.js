const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/ApiError");

// @desc   get all products
// route  GET /api/v1/products
exports.getProducts = asyncHandler(async (req, res) => {
  //1-for filtration using = operators
  const queryStringObj = { ...req.query };
  const excludes = ["limit", "page", "fields", "sort"];
  excludes.forEach((field) => delete queryStringObj[field]);
  console.log("req", queryStringObj);
  //  let mongooseQuery = ProductModel.find(queryStringObj)

  // filtration using [gte,gt,lte,lt]
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
  console.log(JSON.parse(queryStr));
  //  let mongooseQuery = ProductModel.find(JSON.parse(queryStr))

  // 2-for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  //Build Query
  let mongooseQuery = ProductModel.find({})
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // 3-sorting
  console.log("eq>>>>", req.query);
  if (req.query.sort) {
    // if sort has more than 1 parameter
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    mongooseQuery = mongooseQuery.sort(sortBy);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 4-field limitations
  if (req.query.fields) {
    let { fields } = req.query;
    fields = fields.split(",").join(" ");
    console.log("fields", fields);
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // 5-Search
  if (req.query.keyword) {
    const query = {};
    query.$or = [
      { title: { $regex: req.query.keyword, $options: "i" } },
      { description: { $regex: req.query.keyword, $options: "i" } },
    ];
    mongooseQuery = mongooseQuery.find(query);
  }

  //Excute query
  const products = await mongooseQuery;
  res
    .status(200)
    .json({ results: products.length, page: page, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!product) {
    // res.status(400).json({msg:"no product found for this id"})
    return next(new ApiError("no product found for this id", 404));
  }
  res.status(200).json({ data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await await ProductModel.create(req.body);
  // .populate({ path: "subcategories", select: "name" });
  res.status(200).json({ data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError("no product found for this id", 404));
  }
  res.status(200).json({ data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError("no product found for this id", 404));
  }
  res.status(204).json({ msg: "deleted" });
});

// module.exports=getCategories,createCategory
