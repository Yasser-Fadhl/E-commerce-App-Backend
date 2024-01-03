const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.errorStatus = err.errorStatus || 500;
  err.message = err.message || "internal error";

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.errorStatus).json({
      success: false,
      error: err,
      errMessage: err.message || "internal error",
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;
    // Cast Errors
    if (err.name === "CastError") {
      const message = `Resource is not valid: Invalid ${err.path}`;
      error = new ErrorHandler(message, 400);
    }
    // validation errors
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((c) => c.message);

      error = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
      error = new ErrorHandler(
        `Duplicated ${Object.keys(err.keyValue)} is entered`,
        400
      );
    }

    res.status(err.errorStatus).json({
      success: false,
      Message: error.message || "Internal Error",
    });
  }
};
