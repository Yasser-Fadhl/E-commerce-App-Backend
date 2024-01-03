const catchAsyncErorrs = require("./catchAsyncErrors");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ErrorHandler = require("../utils/errorHandler");

// User Authentication
exports.isAuthenticated = catchAsyncErorrs(async (req, res, next) => {
  dotenv.config({ path: "../config/config.env" });
  const { token } = req.cookies;
  if (!token)
    return next(
      new ErrorHandler("Please login first to access the resources", 401)
    );
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  next();
});

//Admin Authorization
exports.authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not allowed`, 403)
      );
    }
    next();
  };
};
