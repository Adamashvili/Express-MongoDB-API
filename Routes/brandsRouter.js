const express = require("express")
const brandsController = require("../Controlers/brandsController")

const router = express.Router()

router.route("/")
.get(brandsController.getAllBrands)

module.exports = router
