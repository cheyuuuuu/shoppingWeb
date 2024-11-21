const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  tel: { type: String, required: true },
  commdities: [
    {
      commodityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commodity",
        required: true,
      },
    },
  ],
  totalPrice: { type: Number, required: true },

  createTime: { type: Date, default: Date.now },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
