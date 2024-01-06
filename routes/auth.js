const express = require("express");
const path = require("path");
const multer = require("multer");
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

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/users/avatar");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
router.post("/register", upload.single("avatar"), registerUser);
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
