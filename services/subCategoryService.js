const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/ApiError");

exports.setParametersToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createSubCategory = asyncHandler(async (req, res) => {
  //desc      create subcategory
  //route     /api/v1/subcategories
  //access    private
  console.log("reqqq", req.params);
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(200).json({ data: subCategory });
});

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  // eslint-disable-next-line no-const-assign
  if (req.params.categoryId) {
    filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
  }
  next();
};
exports.getsubCategories = asyncHandler(async (req, res) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 4;
  const skip = (page - 1) * limit;

  const subCategories = await SubCategoryModel.find(req.filterObj)
    .skip(skip)
    .limit(limit);
  console.log("req...", req.params);
  res
    .status(200)
    .json({ results: subCategories.length, page: page, data: subCategories });
});

exports.getSbuCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findById(id);
  if (!subCategory) {
    // res.status(400).json({msg:"no category found for this id"})
    return next(new ApiError("no category found for this id", 404));
  }
  res.status(200).json({ data: subCategory });
});

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;

  const subCategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError("no subcategory found for this id", 404));
  }
  res.status(200).json({ data: subCategory });
});

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await SubCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError("no subcategory found for this id", 404));
  }
  res.status(204).json({ msg: "deleted" });
});
