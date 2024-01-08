const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", orders);
app.use(errorsMiddleware);
module.exports = app;
