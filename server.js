const express = require("express");
const cors = require("cors");

const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });
const morgan = require("morgan");
const dbConnection = require("./config/database");
// const categoryRoute = require("./routes/categoryRoute");
// const subcategoryRoute = require("./routes/subCategoryRoute");
// const brandRoute = require("./routes/brandRoute");
// const productRoute = require("./routes/productRoute");
// const userRoute = require("./routes/userRoute");
// const AuthRoute = require("./routes/authRoute");
// const reviewRoute = require("./routes/reviewRoute");
// const wishListRoute = require("./routes/wishListRoute");
// const addressRoute = require("./routes/addressRoute");
// const cartRoute = require("./routes/cartRoute");
// const couponRoute = require("./routes/couponRoute");
const mountRoutes = require("./routes/index");

const ApiError = require("./utils/ApiError");
const globalError = require("./middelwares/errorMiddleware");
// express app
const app = express();

// connect to db
dbConnection();

// middlewares
// eslint-disable-next-line eqeqeq
if (process.env.NODE_ENV == "development") {
  const dev = process.env.NODE_ENV;
  app.use(morgan("dev"));
  console.log(`we using now ${dev}`);
}
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// Mount routes
mountRoutes(app);
// app.use("/api/v1/categories", categoryRoute);
// app.use("/api/v1/subcategories", subcategoryRoute);
// app.use("/api/v1/brands", brandRoute);
// app.use("/api/v1/products", productRoute);
// app.use("/api/v1/users", userRoute);
// app.use("/api/v1/auth", AuthRoute);
// app.use("/api/v1/reviews", reviewRoute);
// app.use("/api/v1/wishlist", wishListRoute);
// app.use("/api/v1/address", addressRoute);
// app.use("/api/v1/cart", cartRoute);
// app.use("/api/v1/coupon", couponRoute);

app.all("*", (req, res, next) => {
  // const err=new Error(`cant find this route ${req.originalUrl}`)
  // next(err.message)
  // generate error
  next(new ApiError(`cant find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware for Express
app.use(globalError);
const PORT = process.env.PORT || 8000;

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

const corsOptions = {
  origin: "http://127.0.0.1:8000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
