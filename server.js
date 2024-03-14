require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const {
  userRouter,
  authRouter,
  blogRouter,
  productRouter,
  productCatRouter,
  blogCatRouter,
  brandRouter,
  couponRouter,
} = require("./routs");
const { notFound, ErrorHandler } = require("./middlewares/ErrorHandler");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const product = require("./model/product");
const morgan = require("morgan");

//conect db
connectDB();

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("home page");
});

app.use("/users", userRouter);
app.use("/", authRouter);
app.use("/product", productRouter);
app.use("/blog", blogRouter);
app.use("/productcategory", productCatRouter);
app.use("/blogcategory", blogCatRouter);
app.use("/brand", brandRouter);
app.use("/coupon", couponRouter);

app.use(notFound);
app.use(ErrorHandler);

app.listen(port, () => {
  console.log("server is runung");
});
