const asyncHandler = require("express-async-handler");
const ApiError = require("./ApiError");
const ApiFeatures = require("./apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError("no category found for this id", 404));
    }
    res.status(204).json({ msg: "deleted" });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError("no brand found for this id", 404));
    }
    res.status(200).json({ data: document });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      // res.status(400).json({msg:"no brand found for this id"})
      return next(new ApiError("no brand found for this id", 404));
    }
    res.status(200).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    // another way fro creating
    const brand = await Model.create(req.body);
    res.status(200).json({ data: brand });
  });

exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }

    // get no of documents first
    const documentCounts = await Model.countDocuments();
    //Build Query
    const apiFeature = new ApiFeatures(Model.find(filter), req.query);
    apiFeature
      .search(modelName)
      .filter()
      .sort()
      .limitFields()
      .paginate(documentCounts);
    // .populate({ path: "category", select: "name -_id" });

    //Excute query
    const { mongoQuery, paginationResult } = apiFeature;
    const documents = await mongoQuery;
    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
