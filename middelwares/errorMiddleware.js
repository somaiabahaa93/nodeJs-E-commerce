const ApiError = require("../utils/ApiError");

const handelJWTError = () =>
  new ApiError("invalid token please login again", 401);

const handelJWTExpireError = () =>
  new ApiError("token has been expired please login again", 401);

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-use-before-define
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err = handelJWTError();
    }
    if (err.name === "TokenExpiredError") {
      err = handelJWTExpireError();
    }
    // eslint-disable-next-line no-use-before-define
    sendErrorForPro(err, res);
  }
};

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForPro = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
module.exports = globalError;
