const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/ApiError");

// @desc   get all categories
// route  GET /api/v1/categories
exports.getCategories = asyncHandler(async (req, res) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 4;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res
    .status(200)
    .json({ results: categories.length, page: page, data: categories });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    // res.status(400).json({msg:"no category found for this id"})
    return next(new ApiError("no category found for this id", 404));
  }
  res.status(200).json({ data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError("no category found for this id", 404));
  }
  res.status(200).json({ data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError("no category found for this id", 404));
  }
  res.status(204).json({ msg: "deleted" });
});

exports.createCategory = asyncHandler(async (req, res) => {
  // console.log("name",name)
  // const newCategory=new CategoryModel({name})
  // newCategory.save().then((doc)=>{
  //     res.json(doc)
  // })

  // another way fro creating
  const { name } = req.body;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(200).json({ data: category });
});
// module.exports=getCategories,createCategory
