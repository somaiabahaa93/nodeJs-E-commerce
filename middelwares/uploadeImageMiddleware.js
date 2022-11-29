const multer = require("multer");
const ApiError = require("../utils/ApiError");

exports.uploadSingleImage = (fieldName) => {
  // 1-diskStorage
  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });
  // 2-memory Storage if needed to make proccessing
  const multerStorage = multer.memoryStorage();
  // filter files to images only
  multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images are allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.single(fieldName);
};
