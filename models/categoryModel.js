const mongoose = require("mongoose");

// creating schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requird: [true, "category is required"],
      unique: [true, "category must be unique"],
      minlength: [2, "min length is 2"],
      maxlength: [32, "max length is 32 char"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// creating model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
