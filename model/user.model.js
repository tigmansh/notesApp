const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  pass: String,
  email: String,
  age: Number,
},{
  versionKey: false,
});

const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
