const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  const acceptableExtensions = [".png", ".jpg", ".jpeg"];
  if (!acceptableExtensions.includes(path.extname(file.originalname))) {
    return cb("Please upload only image of jpg jpeg or png format");
  }

  cb(null, true);
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// module.exports = { storage, fileFilter };
