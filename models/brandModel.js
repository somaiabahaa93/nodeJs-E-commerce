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
    image: String,
  },
  { timestamps: true }
);

// middleware for making image URL
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_Url}/brands/${doc.image}`;

    doc.image = imageUrl;
  }
};
// getOne,get all,update
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

// create
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// creating model
const BrandModel = mongoose.model("brand", brandSchema);

module.exports = BrandModel;
