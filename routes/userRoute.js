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

router.get("/", getUsers);
router.put("/changePassword/:id", changePasswordValidator, updateUserPassword);
router
  .route("/")
  .get(getUserValidator, getUsers)
  .post(uploadeUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUser)
  .put(uploadeUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
