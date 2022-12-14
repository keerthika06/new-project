const PlaceModel = require("./PlaceSchema");
const UserModel = require("./User/UserSchema");
const AboutUsModel = require("./admin/aboutUs");

module.exports = {
  User: UserModel,
  Place: PlaceModel,
  AboutUs: AboutUsModel,
};
