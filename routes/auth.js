const express = require("express");
const {
  registerUser,
  loginUser,
  userDetails,
  updateUser,
  updatePassword,
  resetPassword,
  forgetPassword,
  logout,
  getAllUsers,
  getUser,
  adminUpdateUser,
  adminDelUser,
} = require("../controllers/authController");

const { isAuthenticated, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser), router.get("/logout", logout);
router.post("/password/forgot", forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated, userDetails);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/me/update").put(isAuthenticated, updateUser);
router
  .route("/admin/getAllUsers")
  .get(isAuthenticated, authorizedRoles("admin"), getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizedRoles("admin"), getUser)
  .put(isAuthenticated, authorizedRoles("admin"), adminUpdateUser)
  .delete(isAuthenticated, authorizedRoles("admin"), adminDelUser);

module.exports = router;
