const express = require("express");
const cloudinary = require("cloudinary");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const auth = require("./routes/auth");
const products = require("./routes/products");
const orders = require("./routes/orders");
const errorsMiddleware = require("./middlewares/errors");
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", orders);
app.use(errorsMiddleware);
module.exports = app;
