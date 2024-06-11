const crypto = require("crypto");

const bcrypt = require("bcrypt");

const asyncHandler = require("express-async-handler");
const { response } = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const ClintFrontEndModel = require("../models/clintModelFrontEnd");

const ApiError = require("../utils/ApiError");
const { sendEmail } = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

// eslint-disable-next-line no-return-assign

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



// check if the user logged in (authentication)
exports.protect = asyncHandler(async (req, res, next) => {
  // 1-check if token exists
  // console.log(req.headers);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // console.log("token", token);
  if (!token) {
    return next(new ApiError("you are not logged right now", 401));
  }
  // 2-check token not changed & not expired
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // console.log("decoded", decoded);

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
  req.user = currentUser;
  next();
});

// check user permissions(authorization)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1-access roles
    // 2-access logged in user
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("you are not allowed to access this route ", 403)
      );
    }
    next();
  });

// functions for forget password
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // 1-check email is exist
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("this email is not exists ", 404));
  }
  // 2-generate random 6 numbers and save it in db
  const restCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(restCode)
    .digest("hex");
  user.passwordResetCode = hashedResetCode;
  user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
  user.passwordRestVerified = false;
  // console.log("user----", user);
  user.save();
  // 3-send email to user
  const message = `hi ${user.name} \n
  this email is send to you to rest your password \n
  with the new reset code ${restCode}`;

  await sendEmail({
    email: user.email,
    subject: "your code is valid for 10 min only ",
    message: message,
  });
  res
    .status(200)
    .json({ status: "success", message: "reset code send to the email" });

  // 4-user send code
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1-verify reset code with db
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.resetcode)
    .digest("hex");
  const user = await UserModel.findOne({
    passwordResetCode: hashedCode,
    passwordResetCodeExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("resetCode is expired or invalid"));
  }
  // 2-reset code is verified
  user.passwordRestVerified = true;
  await user.save();
  response.status(200).json({ status: "success" });
});

exports.verifyResetPassword = asyncHandler(async (req, res, next) => {
  // 1-check email
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("no user found for this email", 404));
  }
  // 2-check resetCode is verified
  if (!user.passwordRestVerified) {
    return next(new ApiError("reset code not verified", 400));
  }

  // if every thing is okey
  user.password = req.body.newpassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordRestVerified = undefined;
  await user.save();
  const token = createToken(user._id);
  res.status(200).json({ token: token });
});

// frontEndProject

exports.frontEndSignUp = asyncHandler(async (req, res, next) => {
  //1- create user
  const user = await ClintFrontEndModel.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
  });

  // 2-send token
  if (user) {
    const token = createToken(user._id);
    res.status(201).json({ data: user, message: "success", token });
  }
});

exports.frontEndlLogin = asyncHandler(async (req, res, next) => {
  // 1-check email & password in body ----validation
  // 2- password is connected for email and email is exist
  // 3-generate token
  const user = await ClintFrontEndModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("invalid email or password ", 401));
  }
  const token = createToken(user._id);

  res.status(200).json({ data: user, token, message: "success" });
});
