const Cart = require("../Models/cartModel");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [{ product: productId, quantity }],
      });
    } else {
      const existingProduct = cart.products.find(
        (item) => item.product.toString() === productId,
      );

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "products.product",
    );

    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.updateProductInCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    const existingProduct = cart.products.find(
      (item) => item.product.toString() === productId,
    );

    existingProduct.quantity = quantity;
    await cart.save();
    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== req.params.productId,
    );

    await cart.save();

    res.status(200).json({
      status: "success",
      data: cart,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
