const express = require("express");
const router = express.Router();
const advancedResults = require("../middlewares/advancedResults");
const Product = require("../models/product");
const {
  getProducts,
  getOneProduct,
  newProducts,
  updateProduct,
  deleteProduct,
  updateReview,
  deleteReview,
  allReviews,
} = require("../controllers/productsControllers");
const { isAuthenticated, authorizedRoles } = require("../middlewares/auth");
router.route("/products").get(advancedResults(Product), getProducts);
router
  .route("/products/new")
  .post(isAuthenticated, authorizedRoles("admin"), newProducts);
router.route("/products/:id").get(getOneProduct);
router
  .route("/admin/products/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteProduct);
router.route("/product/review").put(isAuthenticated, updateReview);

router
  .route("/product/reviews")
  .get(isAuthenticated, allReviews)
  .delete(isAuthenticated, deleteReview);
module.exports = router;
