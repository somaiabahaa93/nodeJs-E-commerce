const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");

// eslint-disable-next-line no-return-assign
const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.EXPIRE_SECRET_KEY,
  });

exports.signUp = asyncHandler(async (req, res, next) => {
  //1- create user
  const user = await UserModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body,
  });

  // 2-send token
  if (user) {
    const token = createToken(user._id);
    res.status(201).json({ data: user, token });
  }
});

exports.login = asyncHandler(async (req, res, next) => {
  // 1-check email & password in body ----validation
  // 2- password is connected for email and email is exist
  // 3-generate token
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("invalid email or password ", 401));
  }
  const token = createToken(user._id);

  res.status(200).json({ data: user, token });
});

exports.protect = asyncHandler(async (req, res, next) => {
  // 1-check if token exists
  console.log(req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("token", token);
  if (!token) {
    return next(new ApiError("you are not logged right now", 401));
  }
  // 2-check token not changed & not expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log("decoded", decoded);

  // 3-chek user exists for this token
  const currentUser = await UserModel.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("there is no user with this token", 401));
  }

  // 4-check if user not change password after token created
  if (currentUser.changePasswordAt) {
    const passwordCangedTimeStamp = parseInt(
      currentUser.changePasswordAt.getTime() / 1000,
      10
    );
    if (passwordCangedTimeStamp > decoded.iat)
      return next(
        new ApiError(
          "user recently has changed his password ,please login again",
          401
        )
      );
  }
  next();
});
