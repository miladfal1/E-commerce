const express = require("express");
const router = express.Router();
const { userController } = require("../controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

router.route("/register").post(userController.register);
router.route("/login").post(userController.login);
router.route("/login-admin").post(userController.loginAdmin);
router.route("/logout").post(userController.logOut);
router.route("/password").put(authMiddleware, userController.updatePassword);

module.exports = router;
