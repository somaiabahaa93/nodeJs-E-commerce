const mongoose = require("mongoose");

// creating schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requird: [true, "brand is required"],
      unique: [true, "brand must be unique"],
      minlength: [2, "min length is 2"],
      maxlength: [32, "max length is 32 char"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// creating model
const BrandModel = mongoose.model("brand", brandSchema);

module.exports = BrandModel;
