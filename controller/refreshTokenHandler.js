const user = require("../model/users");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookie");
  const refreshToken = cookie.refreshToken;
  const finduser = await user.findOne({ refreshToken: refreshToken });
  if (!finduser)
    throw new Error("no refreshtoken present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || finduser.id !== decoded.id) {
      throw new Error("there is something wrong with refresh token");
    }
    const accessToken = generateToken(findUser?.username);
    res.json({ accessToken });
  });
});

module.exports = handleRefreshToken;
