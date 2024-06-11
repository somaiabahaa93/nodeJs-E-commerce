const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [2, "too short product title"],
      maxLength: [200, "too long title"],
      reguired: [true, "product title is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "product description is required"],
      minLength: [20, "too short description"],
      maxLength: [2000, "too long description"],
    },
    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "product price is required"],
      trim: true,
      max: [200000, "too much price for product"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    images: [String],
    imageCover: {
      type: String,
      required: [true, "  image cover is required"],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "category is required for a product"],
    },

    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "min rating is 1.0"],
      max: [5, "max rating is 5.0"],
    },
    ratingQuantitiy: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual populate to get reviews of product
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
// mongoose query middleware to make populate
productSchema.pre(/^find/, function (next) {
  // eslint-disable-next-line no-unused-expressions
  this.populate({
    path: "category",
    select: "name -_id",
    // eslint-disable-next-line no-sequences
  }).populate({
    path: "brand",
    select: "name -_id",
    // eslint-disable-next-line no-sequences
  }),
    next();
});

// middleware for making image URL

setImagesUrls = (doc) => {
  if (doc.images) {
    const imagesArr = [];

    doc.images.forEach((image) => {
      const imgUrl = `${process.env.BASE_Url}/products/${image}`;
      imagesArr.push(imgUrl);
    });
    doc.images = imagesArr;
  }

  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_Url}/products/${doc.imageCover}`;

    doc.imageCover = imageUrl;
  }
};

// getOne,get all,update
productSchema.post("init", (doc) => {
  setImagesUrls(doc);
});

// create
productSchema.post("save", (doc) => {
  setImagesUrls(doc);
});
module.exports = mongoose.model("Product", productSchema);
