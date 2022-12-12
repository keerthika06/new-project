const PlaceModel = require("./PlaceSchema");
const UserModel = require("./User/UserSchema");

module.exports = {
  User: UserModel,
  Place: PlaceModel,
};
