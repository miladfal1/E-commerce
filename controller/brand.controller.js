const Brand = require("../model/brand");
const slugify = require("slugify");

const createBrand = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newBrand = await Brand.create(req.body);
    res.json(newBrand);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getaBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const findBrand = await Brand.findById(id);
    res.json(findBrand);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBrand = async (req, res) => {
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

    let query = Brand.find(JSON.parse(queryString));

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
      const BrandCount = await Brand.countDocuments();
      if (skip >= BrandCount) throw new Error("this page is not exists");
    }
    const findBrand = await query;
    res.json(findBrand);
  } catch (error) {
    throw new Error(error);
  }
};

const updateBrand = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const filter = { _id: id };
    const update = req.body;

    const updatedBrand = await Brand.findOneAndUpdate(filter, update, {
      new: true,
    });

    console.log(updatedBrand);
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;
  try {
    const filter = { _id: id };

    const deleteBrand = await Brand.findByIdAndDelete(filter);

    console.log(deleteBrand);
    res.json(deleteBrand);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBrand,
  getaBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
};
