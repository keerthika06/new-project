const { internalServerError } = require("../../utils/commonErrors");
const { default: mongoose } = require("mongoose");
const { AboutUs } = require("../../models/index");
const { User } = require("../../models");

const addaboutUs = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    // const { aboutUs } = req.body;
    //const aboutus = await AboutUs.create({ about: req.body.about });
    const aboutus = await AboutUs.findOneAndUpdate({ about: req.body.about });

    //const result = await aboutus.save();

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Added aboutus successfully",
      //data: result,
    });
  } catch (error) {
    console.log("Error, couldn't add about us", error);
    internalServerError(res, error);
  }
};

const getaboutUs = async (req, res) => {
  try {
    if (!req.query)
      return res
        .status(400)
        .json({ status: false, statusCode: 400, message: "body is not found" });
    // const { aboutUs } = req.body;
    const aboutus = await AboutUs.find({});
    //const result = await aboutus.save();

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "About us fetched successfully",
      data: aboutus,
    });
  } catch (error) {
    console.log("Error, couldn't add feedback", error);
    internalServerError(res, error);
  }
};
module.exports = {
  addaboutUs,
  getaboutUs,
};
