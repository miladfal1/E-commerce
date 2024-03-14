const express = require("express");
const router = express.Router();
const { productController } = require("../controller");
const { isAdmin, authMiddleware } = require("../middlewares/auth.middleware");

router
  .route("/")
  .post(authMiddleware, isAdmin, productController.createProduct);
router.route("/rating").put(authMiddleware, productController.rating);
router.route("/wishlist").put(authMiddleware, productController.addToWishlist);

router.route("/").get(productController.getAllproduct);
router.route("/:id").get(productController.getaProduct);
router
  .route("/:id")
  .put(authMiddleware, isAdmin, productController.updateProduct);
router
  .route("/:id")
  .delete(authMiddleware, isAdmin, productController.deleteProduct);

module.exports = router;
