const categoryRoute = require("./categoryRoute");
const subcategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const AuthRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const wishListRoute = require("./wishListRoute");
const addressRoute = require("./addressRoute");
// eslint-disable-next-line import/no-unresolved, import/extensions, node/no-missing-require
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

// eslint-disable-next-line import/no-unresolved
const couponRoute = require("./couponRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subcategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", productRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", AuthRoute);
  app.use("/api/v1/reviews", reviewRoute);
  app.use("/api/v1/wishlist", wishListRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);

  app.use("/api/v1/coupon", couponRoute);
};

module.exports = mountRoutes;
