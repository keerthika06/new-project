const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  placeName: { type: String },
  placePic: {
    public_id: {
      type: String,
      // required: true,
    },
    url: {
      type: String,
      //required: true,
    },
  },
  rating: { type: Number },
  description: { type: String },
  address: { type: String },
  stars: {
    type: Number,
    enum: [1, 2, 3, 4],
    //   default: "Inprogress",
  },
  phone: { type: String },
  photos: [
    {
      public_id: {
        type: String,
        // required: true,
      },
      url: {
        type: String,
        //required: true,
      },
    },
  ],
  review: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
      reviewtext: { type: String, required: true },
      date: { type: String, required: true },
      reviewPic: {
        public_id: {
          type: String,
          // required: true,
        },
        url: {
          type: String,
          //required: true,
        },
      },
    },
  ],

  latitude: { type: String },
  longitude: { type: String },

  acceptsCreditCard: {
    type: Boolean,
  },
  delivery: {
    type: Boolean,
  },
  dogFriendly: {
    type: Boolean,
  },
  familyFriendly: {
    type: Boolean,
  },
  inWalkingDistance: {
    type: Boolean,
  },
  outdoorSeating: {
    type: Boolean,
  },
  parking: {
    type: Boolean,
  },
  wifi: {
    type: Boolean,
  },
});

const PlaceModel = mongoose.model("PlaceModel", PlaceSchema);
module.exports = PlaceModel;
