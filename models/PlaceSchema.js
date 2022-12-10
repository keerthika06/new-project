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
  rating: { type: Number,default: 0, },
  description: { type: String },
  address: { type: String },
  stars: {
    type: Number,
    enum: [1, 2, 3, 4],
       default: 1,
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
    default: false
  },
  delivery: {
    type: Boolean,
    default: false
  },
  dogFriendly: {
    type: Boolean,
    default: false
  },
  familyFriendly: {
    type: Boolean,
    default: false
  },
  inWalkingDistance: {
    type: Boolean,
    default: false
  },
  outdoorSeating: {
    type: Boolean,
    default: false
  },
  parking: {
    type: Boolean,
    default: false
  },
  wifi: {
    type: Boolean,
    default: false
  },
});

const PlaceModel = mongoose.model("PlaceModel", PlaceSchema);
module.exports = PlaceModel;
