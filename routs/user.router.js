const express = require("express");
const router = express.Router();
const { userController } = require("../controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

router.route("/all").get(userController.getAllUsers);
router.route("/profile").get(authMiddleware, userController.profile);
router.route("/profile").delete(authMiddleware, userController.deleteUser);
router.route("/wish-list").get(authMiddleware, userController.getWishList);
router
  .route("/profile/save-address")
  .put(authMiddleware, userController.saveAddress);
router
  .route("/edituser")
  .put(authMiddleware, isAdmin, userController.updateUser);
router
  .route("/blockuser/:username")
  .put(authMiddleware, isAdmin, userController.blockUser);

router
  .route("/unblockuser/:username")
  .put(authMiddleware, isAdmin, userController.unblockUser);

router.route("/refresh").get(userController.handleRefreshToken);

router.route("/cart").post(authMiddleware, userController.userCart);
router.route("/cart").get(authMiddleware, userController.getUserCart);
router.route("/empty-cart").delete(authMiddleware, userController.emptyCart);
router.route("/cart/coupon").post(authMiddleware, userController.applyCoupon);

module.exports = router;
