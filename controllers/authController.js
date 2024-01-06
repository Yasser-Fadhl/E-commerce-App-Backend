const User = require("../models/user");
const catchAsyncErorrs = require("../middlewares/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

exports.registerUser = catchAsyncErorrs(async (req, res, next) => {
  const avatar = req.file.filename;
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return next(
      new ErrorHandler("Please enter a valid name, email and password", 400)
    );
  const isUser = await User.findOne({ email: req.body.email });
  if (isUser) {
    return next(new ErrorHandler("email is already registered ", 400));
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: Date.now(),
      url: avatar,
    },
  }).catch((err) => console.log(err));
  sendToken(user, 200, res);
});

exports.loginUser = catchAsyncErorrs(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email or Password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPaswordMatched = await user.comparePassword(password);
  if (!isPaswordMatched) {
    return next(new ErrorHandler("Invalid password or Email ", 401));
  }
  sendToken(user, 200, res);
});

exports.userDetails = catchAsyncErorrs(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

exports.updatePassword = catchAsyncErorrs(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPaswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPaswordMatched) next(new ErrorHandler("Old password is incorrect"));
  if (!req.body.newPassword === req.body.confirmedPassword)
    next(new ErrorHandler("Passwords do not match"), 400);
  user.password = req.body.newPassword;
  //user.resetPasswordToken = undefined;
  ///user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

exports.updateUser = catchAsyncErorrs(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);
    const image_id = user.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avatars",
      width: 150,
      crop: "scale",
    });
    newData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }
  const user = await User.findByIdAndUpdate(req.user.id, newData);

  await user.save();
  res.status(200).json({
    success: true,
    message: "User updated successfully.",
  });
});

exports.forgetPassword = catchAsyncErorrs(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User not found", 401));
  const resetToken = user.getResetPasswordToken();
  await user.save({ validatebeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}}`;
  const message = `Your password reset token is :\n${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery Email",
      message,
    });
    res.status(200).json({
      success: true,
      message: `email was successfully sent to ${user.email}`,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validatebeforeSave: false });
    return next(new ErrorHandler(err.message, 500));
  }
});
exports.resetPassword = catchAsyncErorrs(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Reset token is invalid or has been expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmedPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});
exports.logout = catchAsyncErorrs(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "You are logged out",
    });
});

exports.getAllUsers = catchAsyncErorrs(async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});
exports.getUser = catchAsyncErorrs(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return next(
      new ErrorHandler(`User with ID ${req.params.id} doesn't exist`, 500)
    );

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminUpdateUser = catchAsyncErorrs(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newData);
  if (!user) return next(new ErrorHandler("Product not found", 404));
  await user.save();
  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});
exports.adminDelUser = catchAsyncErorrs(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new ErrorHandler("Product not found", 404));
  await user.remove();

  res.status(200).json({
    success: true,
    message: "User is removed successfully",
  });
});
