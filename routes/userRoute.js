const express = require("express");

const router = express.Router();
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
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
} = require("../services/userService");
const authService = require("../services/authService");

router.get(
  "/",
  authService.protect,
  authService.allowedTo("admin", "manager"),
  getUsers
);
router.put("/changePassword/:id", changePasswordValidator, updateUserPassword);
router
  .route("/")
  .get(getUserValidator, getUsers)
  .post(
    authService.protect,
    authService.allowedTo("admin"),
    uploadeUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(authService.protect, authService.allowedTo("admin"), getUser)
  .put(
    authService.protect,
    authService.allowedTo("admin"),
    uploadeUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );

module.exports = router;
