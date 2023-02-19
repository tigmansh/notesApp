const express = require("express");
const { userModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userRouter = express.Router();

// Hashing the password while registering the user 👇

userRouter.post("/register", async (req, res) => {
  const { name, pass, email, age } = req.body;
  try {
    bcrypt.hash(pass, 8, async (err, hash) => {
      if (err) {
        console.log(err);
      } else {
        const user = new userModel({ name, pass: hash, email, age });
        await user.save();
        res.send({ msg: "User Registered" });
      }
    });
  } catch (err) {
    res.send({ msg: "Something went Wrong", Error: err.message });
  }
});

// login and bcrypting the hashed password here only 👇
userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await userModel.find({ email });

    const hashed_pass = user[0].pass;

    if (user.length > 0) {
      bcrypt.compare(pass, hashed_pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, process.env.key, {
            expiresIn: 18000,
          });
          res.send({ msg: "Login Successful", token: token });
        } else {
          res.send({ msg: "Wrong credentials" });
        }
      });
    } else {
      res.send({ msg: "Wrong credentials" });
    }
  } catch (err) {
    res.send({ msg: "Something went Wrong", Error: err.message });
  }
});

module.exports = { userRouter };
