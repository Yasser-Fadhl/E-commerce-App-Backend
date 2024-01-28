const express = require("express");
const router = express.Router();
const {
  processPayment,
  sendStripeApi,
} = require("../controllers/paymentController");
const { isAuthenticated, authorizedRoles } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticated, processPayment);
router.route("/stripeapikey").get(isAuthenticated, sendStripeApi);

module.exports = router;
