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
  favorite: [
    {
      //placeId: { type: mongoose.Schema.Types.ObjectId, ref: "PlaceModel" },
      listOfPlaceId: {
        type: String,
      },
    },
    //{ type: Boolean, default: false },
  ],
  feedbackText: [
    {
      type: String,
    },
  ],
});

const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
//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
