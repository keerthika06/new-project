const PlaceModel = require("./PlaceSchema");
const UserModel = require("./User/UserSchema");
const AboutUsModel = require("./admin/aboutUs");
const NearCityModel = require("./admin/nearCity");

module.exports = {
  User: UserModel,
  Place: PlaceModel,
  AboutUs: AboutUsModel,
  NearCity: NearCityModel,
};
