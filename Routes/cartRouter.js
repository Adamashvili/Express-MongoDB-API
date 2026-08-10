const express = require("express")
const authController = require("../Controlers/authController")
const cartController = require("../Controlers/cartController")
const router = express.Router()



router.route("/")
  .get(authController.protectRoute, cartController.getCart)
  .post(authController.protectRoute, cartController.addToCart)
  .patch(authController.protectRoute, cartController.updateProductInCart);

router.route("/:productId")
  .delete(authController.protectRoute, cartController.removeFromCart);

module.exports = router