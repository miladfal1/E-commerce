const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    // Find the blog which you want to be liked
    const findBlog = await blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = findBlog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyLiked = findBlog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const findBlog = await blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(findBlog);
    }
    if (isDisLiked) {
      const findBlog = await blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(findBlog);
    } else {
      const findBlog = await blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(findBlog);
    }
  });