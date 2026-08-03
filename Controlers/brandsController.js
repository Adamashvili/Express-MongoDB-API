const Brand = require("../Models/brandsModel")

exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find()
        res.status(200).json(brands.map(item => item.brand))
    } catch (error) {
        res.status(400).json({
      status: "failed",
      message: error.message,
    });
    }
}