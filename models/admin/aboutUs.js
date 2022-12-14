const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema({
  about: { type: String, default: "hiiiiiiiiii" },
});
const AboutUsModel = mongoose.model("AboutUsModel", aboutUsSchema);
module.exports = AboutUsModel;
