const express = require("express");
const router = express.Router();
const { blogCategroyController } = require("../controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

router
  .route("/")
  .post(authMiddleware, isAdmin, blogCategroyController.createCategory)
  .get(blogCategroyController.getallCategory);

router
  .route("/:id")
  .put(authMiddleware, isAdmin, blogCategroyController.updateCategory)
  .delete(authMiddleware, isAdmin, blogCategroyController.deleteCategory)
  .get(blogCategroyController.getCategory);

module.exports = router;
