const blog = require("../model/blog");
const user = require("../model/users");
const asyncHandler = require("express-async-handler");

const validateId = require("../utils/validateId");

const createBlog = async (req, res) => {
  try {
    const newBlog = await blog.create(req.body);
    res.json({
      newBlog,
    });
  } catch (erroe) {
    throw new Error(error);
  }
};

const updateBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const updateblog = await blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({
      updateblog,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteblog = await blog.findByIdAndDelete(id);
    res.json({
      deleteblog,
    });
  } catch (erroe) {
    throw new Error(error);
  }
};

const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const getblog = await blog.findById(id).populate("likes").populate("dislikes");
    const updateViews = await blog.findByIdAndUpdate(
      id,
      {
        $inc: { numviews: 1 },
      },
      { new: true }
    );
    res.json(getblog);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBlogs = async (req, res) => {
  const { id } = req.params;
  try {
    const getblogs = await blog.find();
    res.json(getblogs);
  } catch (error) {
    throw new Error(error);
  }
};

const likeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const foundBlog = await blog.findById(blogId);
  const { reqUser } = req.user;
  const findUser = await user.findOne(reqUser);
  const loginUserId = findUser._id;
  const isLiked = foundBlog?.isLiked;
  const alreadyDisliked = foundBlog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString());
  if (alreadyDisliked) {
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  }
  if (isLiked) {
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  } else {
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    res.json(updatedBlog);
  }
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const foundBlog = await blog.findById(blogId);
  const { reqUser } = req.user;
  const findUser = await user.findOne(reqUser);
  const loginUserId = findUser._id;
  const isDisliked = foundBlog?.isDisliked;
  const alreadyLiked = foundBlog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString());
  if (alreadyLiked) {
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  }
  if (isDisliked) {
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
    res.json(updatedBlog);
  } else {
    const updatedBlog = await blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
    res.json(updatedBlog);
  }
});

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlogs,
  likeBlog,
  dislikeBlog,
};
