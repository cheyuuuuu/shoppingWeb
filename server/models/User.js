const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  cart: [
    {
      commodityId: { type: String },
      count: { type: Number, default: 1 },
      addTime: { type: Date, default: Date.now },
    },
  ],
  createTime: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
