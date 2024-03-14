const jwt = require("jsonwebtoken");
const user = require("../model/users");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const findUser = await user.findById(decoded?.id);
        req.user = findUser.username;
        next();
      }
    } catch (error) {
      throw new Error("not authorized , token expire");
    }
  } else {
    throw new Error("there is no token in header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  const adminUser = await user.findOne({ username: req.user });
  console.log(adminUser.role);
  if (adminUser.role !== "admin") {
    throw new Error("you are not a n admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
