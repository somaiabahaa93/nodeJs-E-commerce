const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"], trim: true },
    slug: { type: String, lowercase: true },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "this email is userd befor"],
      lowercase: true,
    },
    phone: String,
    profileImg: String,
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "too short password"],
    },
    changePasswordAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordRestVerified: Boolean,
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postCode: String,
      },
    ],
  },
  { timestamps: true }
);

// hassing password
userSchema.pre("save", async function (doc) {
  this.password = await bcrypt.hash(this.password, 12);
});
// userSchema.post("save", async function (doc) {
//   const pass = await bcrypt.hash(doc.password, 12);
//   doc.password = pass;
// });
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
