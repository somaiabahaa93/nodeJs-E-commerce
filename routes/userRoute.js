const express = require("express");

const router = express.Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadeUserImage,
  resizeImage,
  updateUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
} = require("../services/userService");
const authService = require("../services/authService");

// router.get(
//   "/",
//   authService.protect,
//   authService.allowedTo("admin", "manager"),
//   getUsers
// );

// userRoutes
router.get("/getMe", authService.protect, getLoggedUserData, getUser);
router.put("/changeMyPassword", authService.protect, updateLoggedUserPassword);
router.put(
  "/updateMe",
  authService.protect,
  updateLoggedUserValidator,
  updateLoggedUserData
);

// admin Routes
router.use(authService.protect, authService.allowedTo("admin", "manager"));
router.put("/changePassword/:id", changePasswordValidator, updateUserPassword);

router
  .route("/")
  .get(getUsers)
  .post(uploadeUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUser)
  .put(uploadeUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
