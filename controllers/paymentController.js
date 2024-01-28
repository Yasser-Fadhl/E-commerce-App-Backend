const catchAsyncErorrs = require("../middlewares/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
exports.processPayment = catchAsyncErorrs(async (req, res, next) => {
  const paymentInetent = await stripe.paymentInetent.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: { integration_check: "accept_a_payment" },
  });
  res.status(200).json({
    success: true,
    client_secret: paymentInetent.client_secret,
  });
});
exports.sendStripeApi = catchAsyncErorrs(async (req, res, next) => {
  res.status(200).json({
    stripe_api_key: process.env.STRIPE_API_KEY,
  });
});
