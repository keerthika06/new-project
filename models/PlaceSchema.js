const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  placeName: { type: String },
  placePic: {
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
  },
  rating: { type: String },
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
    },
  ],
  review: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
      },
      review: { type: String, required: true },
      date: { type: String, required: true },
    },
  ],
  distance: {
    latitude: { type: String },
    longitude: { type: String },
  },
  acceptsCreditCard: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
  delivery: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
  dogFriendly: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
  familyFriendly: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
  inWalkingDistance: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
  outdoorSeating: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
  parking: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
  wifi: {
    status: { type: Boolean },
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlaceModel",
    },
  },
});

const PlaceModel = mongoose.model("PlaceModel", PlaceSchema);
module.exports = PlaceModel;
