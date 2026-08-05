const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, "brand is required"],
    minLength: [2, "Brand must be minimum 2 characters"],
    maxLength: [15, "Brand must be maximum 15 characters"],
    enum: {
      values: [
        "Apple",
        "Samsung",
        "Google",
        "OnePlus",
        "Xiaomi",
        "Sony",
        "Motorola",
        "Huawei",
        "Nothing",
        "Oppo",
        "Realme",
        "Vivo",
        "Asus",
      ],
      message: `This brand is not known, choose between Apple, Samsung, Google, OnePlus, Xiaomi, Sony, Motorola, Huawei, Nothing, Oppo, Realme, Vivo, Asus,`,
    },
  },
  model: {
    type: String,
    required: [true, "model is required"],
    minLength: [2, "Model must be minimum 2 characters"],
    maxLength: [15, "Model must be maximum 15 characters"],
  },
  title: {
    type: String,
    required: [true, "title is required"],
    minLength: [2, "Title must be minimum 2 characters"],
    maxLength: [45, "Title must be maximum 45 characters"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
    maxLength: [100, "Please describe with maximum 100 characters"],
  },
  price: {
    current: {
      type: Number,
      required: [true, "Price is required"],
    },
    oldPrice: {
      type: Number,
      required: [true, "Old Price is required"],
    },
    discountPercentage: { type: String },
  },
  stock: {
    type: Number,
    required: [true, "stock is required"],
    min: [0, "Stock can`t be lower than 0"],
    max: [300, "Max Stock num is 300"],
  },
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.length >= 1 && value.length <= 4;
      },
      message: "Images array must contain between 1 and 4 images.",
    },
  },
  color: {
    type: String,
    required: [true, "color is required"],
  },
  colors: {
    type: [String],
    required: [true, "colors is required"],
  },
  ram: {
    type: String,
    required: [true, "ram is required"],
  },
  processor: {
    type: String,
    required: [true, "processor is required"],
  },
  chipset: {
    type: String,
    required: [true, "chipset is required"],
  },
  screenType: {
    type: String,
    required: [true, "screenType is required"],
  },

  createdBy: { type: String },
});

phoneSchema.pre("save", async function (next) {
  this.price.discountPercentage = Math.round(
    ((this.price.oldPrice - this.price.current) / this.price.oldPrice) * 100,
  );
});

phoneSchema.pre("save", async function (next) {
  this.createdBy = "Irakli";
});

phoneSchema.pre("validate", async function (next) {
  this.brand = this.brand.toLowerCase().replace(/^./, char => char.toUpperCase());
  
});

const Phone = mongoose.model("Phone", phoneSchema);

module.exports = Phone;
