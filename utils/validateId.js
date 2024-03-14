const mongoose = require("mongoose");
const User = require("../model/users");

const validateUser = async (username) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error(`Validation error: ${error.message}`);
  }
};

module.exports = validateUser;
