const express = require("express");
const router = express.Router();
const { brandController } = require("../controller");
const { isAdmin, authMiddleware } = require("../middlewares/auth.middleware");

router.route("/").post(authMiddleware, isAdmin, brandController.createBrand);
router.route("/").get(brandController.getAllBrand);
router.route("/:id").get(brandController.getaBrand);
router.route("/:id").put(authMiddleware, isAdmin, brandController.updateBrand);
router
  .route("/:id")
  .delete(authMiddleware, isAdmin, brandController.deleteBrand);

module.exports = router;
