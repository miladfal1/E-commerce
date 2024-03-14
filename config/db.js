const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.mongoDB_URL);
    console.log("connected to db");
  } catch (error) {
    console.log("error in connection", error);
  }
};

module.exports = db;
