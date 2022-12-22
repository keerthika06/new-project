const express = require("express");
const router = express.Router();
const databaseConnect = require("./config/databaseconnection");
const fileupload = require("express-fileupload");
const path = require("path");

const port = process.env.PORT || 5000;

require("dotenv").config();

const refreshRouter = require("./routes/users/refresh");
const userRouter = require("./routes/users/user");
const otpRouter = require("./routes/users/otp");
const placeRouter = require("./routes/places/place");
const adminRouter = require("./routes/admin/aboutus");
// const nearCityRouter = require("./routes/admin/nearCity")
//const feedbackRouter = require("./routes/users/user")

const app = express();
app.use(express.urlencoded({ extended: true }));
router.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome");
});
databaseConnect();
app.use("/", router);
app.use("/api/user", userRouter);

app.use("/api/refresh", refreshRouter);
app.use("/api/otp", otpRouter);
app.use("/api/place", placeRouter);
app.use("/api/admin", adminRouter);

app.listen(port, () => console.log(`Running on port no ${port}`));
