const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String},
  phone: { type: String },
  password: { type: String},
  gender: { type: String, enum: ["Male", "Female"] },
  city: { type: String },
});

const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
