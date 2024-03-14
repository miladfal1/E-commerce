const Coupon = require("../model/coupon");

const createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const allCoupons = await Coupon.find();
    res.json(allCoupons);
  } catch (error) {
    throw new Error(error);
  }
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCoupon = await Coupon.findByIdAndDelete(id);
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
