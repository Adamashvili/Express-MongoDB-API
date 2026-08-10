const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phone",
        required: true
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1
      }
    }
  ]
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;