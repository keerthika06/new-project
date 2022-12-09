const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  password: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  city: { type: String },
});

const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
