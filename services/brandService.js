const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const BrandModel = require("../models/brandModel");
const ApiError = require("../utils/ApiError");

// @desc   get all brands
// route  GET /api/v1/brands
exports.getBrands = asyncHandler(async (req, res) => {
  // for pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 4;
  const skip = (page - 1) * limit;
  const brands = await BrandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page: page, data: brands });
});

exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);
  if (!brand) {
    // res.status(400).json({msg:"no brand found for this id"})
    return next(new ApiError("no brand found for this id", 404));
  }
  res.status(200).json({ data: brand });
});

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const brand = await BrandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError("no brand found for this id", 404));
  }
  res.status(200).json({ data: brand });
});

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await BrandModel.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError("no category found for this id", 404));
  }
  res.status(204).json({ msg: "deleted" });
});

exports.createBrand = asyncHandler(async (req, res) => {
  // console.log("name",name)
  // const newCategory=new CategoryModel({name})
  // newCategory.save().then((doc)=>{
  //     res.json(doc)
  // })

  // another way fro creating
  const { name } = req.body;
  const brand = await BrandModel.create({ name, slug: slugify(name) });
  res.status(200).json({ data: brand });
});
// module.exports=getCategories,createCategory
