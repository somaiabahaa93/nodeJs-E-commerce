const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");
const factory = require("../utils/handlerFactory");
const { uploadSingleImage } = require("../middelwares/uploadeImageMiddleware");
const ApiError = require("../utils/ApiError");
const createToken = require("../utils/createToken");

// middleware for images
exports.uploadeUserImage = uploadSingleImage("profileImg");

// resize images using sharp (processing)
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }
  next();
});

// admin
// @desc   get all users
// route  GET /api/v1/users
// access  private
exports.getUsers = factory.getAll(UserModel);

// @desc   get specific user
// route  GET /api/v1/user/:id
// access  private
exports.getUser = factory.getOne(UserModel);

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      slug: req.body.slug,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("no document found for this id", 404));
  }
  res.status(200).json({ data: document });
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("no document found for this id", 404));
  }
  res.status(200).json({ data: document });
  next();
});
exports.deleteUser = factory.deleteOne(UserModel);

exports.createUser = factory.createOne(UserModel);

// user
// get userData
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// updateUserPassword
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("no document found for this id", 404));
  }
  res.status(200).json({ data: document });
  const token = createToken(req.user._id);
  res.status(200).json({ token });
  // next();
});

// updateUserData
// exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
//   const document = await UserModel.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       phone: req.body.phone,
//       email: req.body.email,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!document) {
//     return next(new ApiError("no document found for this id", 404));
//   }
//   res.status(200).json({ data: document });
// });

exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError("no document found for this id", 404));
  }
  res.status(200).json({ data: document });
});

// asyncHandler(async (req, res, next) => {
//   const document = await UserModel.findByIdAndUpdate(
//     req.user._id,
//     {
//       name: req.body.name,
//       phone: req.body.phone,
//       email: req.body.email,
//     },
//     {
//       new: true,
//     }
//   );
//   if (!document) {
//     return next(new ApiError("no document found for this id", 404));
//   }
//   res.status(200).json({ data: document });
// });
