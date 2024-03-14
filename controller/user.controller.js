const user = require("../model/users");
const Product = require("../model/product");
const Cart = require("../model/cart");
const Coupon = require("../model/coupon");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jwtToken");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const validateUser = require("../utils/validateId");
const { find } = require("../model/order");
const product = require("../model/product");

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const findUser = await user.findOne({ username: username });
  if (!findUser) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({ username, password: hashedPassword });
    res.json(newUser);
  } else {
    throw new Error("user already exist");
  }
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const findUser = await user.findOne({ username: username });
  const match = await bcrypt.compare(password, findUser.password);
  if (findUser && match) {
    const refreshToken = await generateRefreshToken(findUser?.username);
    const updateuser = await user.findOneAndUpdate(
      { username: username },
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      username: findUser?.username,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("invalid password");
  }
});

//admin login
const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const findAdmin = await user.findOne({ username: username });

  if (findAdmin.role !== "admin") throw new Error("Not Authrized");
  const match = await bcrypt.compare(password, findAdmin.password);
  if (findAdmin && match) {
    const refreshToken = await generateRefreshToken(findAdmin?.username);
    const updateuser = await user.findOneAndUpdate(
      { username: username },
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      username: findAdmin?.username,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("invalid password");
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await user.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

const profile = asyncHandler(async (req, res) => {
  try {
    const findUser = await user.findOne({ username: req.user });
    if (findUser) {
      res.json(findUser);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const deleteUser = await user.findOneAndDelete({ username: req.user });

    if (deleteUser) {
      res.json(deleteUser);
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const findUser = await user.findOneAndUpdate(
      { username: req.user },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    if (!findUser) {
      throw new Error("user not found");
    }
    res.status(200).send(findUser);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//save user address

const saveAddress = async (req, res, next) => {
  try {
    const updateUser = await user.findOneAndUpdate(
      { username: req.user },
      {
        address: req?.body?.address,
      },
      { new: true }
    );

    if (!updateUser) {
      throw new Error("user not found");
    }
    res.status(200).send(updateUser);
  } catch (error) {
    throw new Error(error);
  }
};

const blockUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  try {
    const blockUser = await user.findOneAndUpdate(
      { username: username },
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json({
      message: "user blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});
const unblockUser = asyncHandler(async (req, res) => {
  const { username } = req.params;
  try {
    const blockUser = await user.findOneAndUpdate(
      { username: username },
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json({
      message: "user unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookie");
  const refreshToken = cookie.refreshToken;
  const finduser = await user.findOne({ refreshToken: refreshToken });
  if (!finduser) throw new Error("no refreshtoken present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || finduser.username !== decoded.id) {
      throw new Error("there is something wrong with refresh token");
    }
    const accessToken = generateToken(finduser?._id);
    res.json({ accessToken });
  });
});

const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const findUser = await user.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await user.findOneAndUpdate(
    { refreshToken: refreshToken },
    {
      refreshToken: "",
    },
    { new: true }
  );
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});

const updatePassword = async (req, res) => {
  const { password } = req.body;
  validateUser(req.user);
  console.log(req.user);
  const findUser = await user.findOne({ username: req.user });
  console.log(password);
  console.log(findUser);
  const hashedPassword = await bcrypt.hash(password, 10);
  if (password) {
    findUser.password = hashedPassword;
    const updatePassword = await findUser.save();
    res.json(updatePassword);
  } else {
    res.json(user);
  }
};

const getWishList = async (req, res) => {
  try {
    const findUser = await user.findOne({ username: req.user }).populate("wishlist");
    const id = findUser._id;
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
};

const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  try {
    let products = [];
    const findUser = await user.findOne({ username: req.user });
    const id = findUser._id;
    // check if user already have product in cart
    const alreadyExistCart = await Cart.findOne({ orderby: id });

    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new Cart({
      products,
      cartTotal,
      orderby: id,
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUserCart = async (req, res) => {
  try {
    const findUser = await user.findOne({ username: req.user });
    const id = findUser._id;
    const cart = await Cart.findOne({ orderby: id }).populate("products.product");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
};

const emptyCart = async (req, res) => {
  try {
    const findUser = await user.findOne({ username: req.user });
    const id = findUser._id;
    const cart = await Cart.findOneAndDelete({ orderby: findUser.id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
};

const applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("invalid coupon");
  }
  const findUser = await user.findOne({ username: req.user });
  const id = findUser._id;
  let { products, cartTotal } = await Cart.findOne({
    order: findUser.id,
  }).populate("products.product");
  let totalAfterDiscout = (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
  await Cart.findOneAndUpdate({ orderby: findUser.id }, { totalAfterDiscout }, { new: true });
  res.json(totalAfterDiscout);
};

module.exports = {
  register,
  login,
  getAllUsers,
  profile,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  loginAdmin,
  getWishList,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
};
