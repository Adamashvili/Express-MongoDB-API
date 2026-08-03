const express = require("express")
const brandsController = require("../Controlers/brandsController")

const router = express.Router()

router.route("/")
.get(brandsController.getAllBrands)

module.exports = router

//SWAGGER UI for Brands
/**
@swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Failed
 */