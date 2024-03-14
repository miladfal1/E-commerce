const express = require("express");
const router = express.Router();
const { productCategoryController } = require("../controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

router
  .route("/")
  .post(authMiddleware, isAdmin, productCategoryController.createCategory)
  .get(productCategoryController.getallCategory);

router
  .route("/:id")
  .put(authMiddleware, isAdmin, productCategoryController.updateCategory)
  .delete(authMiddleware, isAdmin, productCategoryController.deleteCategory)
  .get(productCategoryController.getCategory);

module.exports = router;
