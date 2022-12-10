const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  password: { type: String },
  profilePic: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      //required: true,
    },
  },
  fav: [
    {
      placeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "placeModel",
      },
    },
  ],
  feedback: [{ type: String }],
  // friends: [{ type : ObjectId, ref: 'User' }],
});

const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
