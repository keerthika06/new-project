const internalServerError = (res, error) => {
  res.status(500).json({
    status: false,
    statusCode: 500,
    message: " AN error occured",
    error: error.name,
    errorMessage: error.message,
  });
};
module.exports = {
  internalServerError,
};
