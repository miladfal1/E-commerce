const product = require("../model/product");
const User = require("../model/users");
const slugify = require("slugify");

const createProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getaProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const findProduct = await product.findById(id);
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllproduct = async (req, res) => {
  try {
    //filtreing
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    console.log(queryObj);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    let query = product.find(JSON.parse(queryString));

    //dorting

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limiting the fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination

    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await product.countDocuments();
      if (skip >= productCount) throw new Error("this page is not exists");
    }
    const findProduct = await query;
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const filter = { _id: id };
    const update = req.body;

    const updatedProduct = await product.findOneAndUpdate(filter, update, {
      new: true,
    });

    console.log(updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const filter = { _id: id };

    const deleteProduct = await product.findByIdAndDelete(filter);

    console.log(deleteProduct);
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const findUser = await User.findOne({ username: req.user });
    const id = findUser._id;
    const alreadyAdded = await findUser.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      let findUser = await User.findByIdAndUpdate(
        id,
        {
          $pull: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(findUser);
    } else {
      let findUser = await User.findByIdAndUpdate(
        id,
        {
          $push: { wishlist: productId },
        },
        {
          new: true,
        }
      );
      res.json(findUser);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const rating = async (req, res) => {
  const findUser = await User.findOne({ username: req.user });
  const id = findUser._id;
  const { star, productId, comment } = req.body;

  try {
    const findProduct = await product.findById(productId);
    let alreadyRated = findProduct.ratings.find(
      (rating) => rating.postedby.toString() === id.toString()
    );

    if (alreadyRated) {
      const updateRating = await product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      const rateProduct = await product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: id,
            },
          },
        },
        {
          new: true,
        }
      );
    }

    const getAllRatings = await product.findById(productId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let ActualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await product.findByIdAndUpdate(
      productId,
      {
        totalrating: ActualRating,
      },
      {
        new: true,
      }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createProduct,
  getaProduct,
  getAllproduct,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
};
