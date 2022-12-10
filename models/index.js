const PlaceModel = require("./placeSchema");
const UserModel = require("./User/UserSchema");

module.exports = {
  User: UserModel,
  Place: PlaceModel,
};
