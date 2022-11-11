const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "it is required"],
      minlength: [2, "too short length"],
      maxlength: [32, "too long lenth"],
    },

    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "subCategory must belong to parent category"],
    },
  },
  { timestamps: true }
);

const subCategoryModel = mongoose.model("subCategory", subCategorySchema);

module.exports = subCategoryModel;
