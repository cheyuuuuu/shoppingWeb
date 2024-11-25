const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  tel: { type: String, required: true },
  commodities: [
    {
      commodityId: { type: String },
      commodityName: { type: String },
      count: { type: Number, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  payment: { type: String, required: true },
  status: { type: String, default: "未處理" },

  createTime: { type: Date, default: Date.now },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
