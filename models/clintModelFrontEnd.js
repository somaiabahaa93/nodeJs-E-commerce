const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const clientFrontEndSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },

    slug: { type: String, lowercase: true },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "this email is userd befor"],
      lowercase: true,
    },
    age: {
      type: Number,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "too short password"],
    },
  },
  { timestamps: true }
);

// hassing password
clientFrontEndSchema.pre("save", async function (doc) {
  this.password = await bcrypt.hash(this.password, 12);
});
// userSchema.post("save", async function (doc) {
//   const pass = await bcrypt.hash(doc.password, 12);
//   doc.password = pass;
// });
const ClintFrontEndModel = mongoose.model(
  "ClientFrontEnd",
  clientFrontEndSchema
);
module.exports = ClintFrontEndModel;
