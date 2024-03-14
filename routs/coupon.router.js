const express = require("express");
const router = express.Router();

const { couponController } = require("../controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

router
  .route("/")
  .post(authMiddleware, isAdmin, couponController.createCoupon)
  .get(authMiddleware, isAdmin, couponController.getAllCoupons);

router
  .route("/:id")
  .put(authMiddleware, isAdmin, couponController.updateCoupon)
  .delete(authMiddleware, isAdmin, couponController.deleteCoupon);

module.exports = router;
