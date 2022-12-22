const mongoose = require("mongoose");

const nearCitySchema = new mongoose.Schema({
  cityName: { type: String },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  photos: {
    url: { type: String },
  },

  dates: { type: Date },
});
nearCitySchema.index({ location: "2dsphere" });
const NearCityModel = mongoose.model("NearCityModel", nearCitySchema);
module.exports = NearCityModel;
