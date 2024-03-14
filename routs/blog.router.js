const express = require("express");
const router = express.Router();
const { blogController } = require("../controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

router.route("/").post(authMiddleware, isAdmin, blogController.createBlog);
router.route("/").get(blogController.getAllBlogs);
router.route("/dislike").put(authMiddleware, blogController.dislikeBlog);
router.route("/like").put(authMiddleware, blogController.likeBlog);
router.route("/:id").put(authMiddleware, isAdmin, blogController.updateBlog);
router.route("/:id").delete(authMiddleware, isAdmin, blogController.deleteBlog);
router.route("/:id").get(authMiddleware, blogController.getBlog);
module.exports = router;
