const express = require("express")
const authController = require("../Controlers/authController")
const router = express.Router()

router.route("/signup").post(authController.signUp)


module.exports = router