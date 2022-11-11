const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subcategoryRoute = require("./routes/subCategoryRoute");
const ApiError = require("./utils/ApiError");
const globalError = require("./middelwares/errorMiddleware");
// express app
const app = express();

// connect to db
dbConnection();

// middlewares
if (process.env.NODE_ENV == "development") {
  const dev = process.env.NODE_ENV;
  app.use(morgan("dev"));
  console.log(`we using now ${dev}`);
}
app.use(express.json());

// routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subcategoryRoute);
app.all("*", (req, res, next) => {
  // const err=new Error(`cant find this route ${req.originalUrl}`)
  // next(err.message)
  // generate error
  next(new ApiError(`cant find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware for Express
app.use(globalError);
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`hi from our server ${PORT}`);
});

// Handel Rejection outside Express
process.on("unhandledRejection", (err) => {
  console.error(`unhandeledRejection`, `${err}`);
  server.close(() => {
    console.error("shutting down ....");
    process.exit();
  });
});
