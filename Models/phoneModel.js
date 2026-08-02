const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({
  brand: { type: String, required: [true, "brand is required"] },
  model: { type: String, required: [true, "model is required"] },
  title: { type: String, required: [true, "title is required"] },
  description: { type: String, required: [true, "description is required"] },
  price: { type: Number, required: [true, "price is required"] },
  stock: { type: Number, required: [true, "stock is required"] },
  color: { type: String, required: [true, "color is required"] },
  image: { type: String, required: [true, "image is required"] },
});

const Phone = mongoose.model("Phone", phoneSchema);


module.exports = Phone