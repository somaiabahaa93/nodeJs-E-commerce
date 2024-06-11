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

// middleware for making image URL
const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_Url}/categories/${doc.image}`;
    // console.log("imageUrLCat",imageUrl)

    doc.image = imageUrl;
  }
};
// getOne,get all,update
// categorySchema.post("init", (doc) => {
//   setImageUrl(doc);
// });


categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

// create
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});
// creating model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
