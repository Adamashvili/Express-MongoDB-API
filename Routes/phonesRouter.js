const express = require("express");
const phonesController = require("../Controlers/phonesController");
const authController = require("../Controlers/authController");

const router = express.Router();
router
  .route("/")
  .get(phonesController.getAllPhones)
  .post(authController.protectRoute, authController.onlyForAdmin('admin'), phonesController.postNewPhone);

router
  .route("/infoofprices")  
  .get(phonesController.additionalInfo);


router
  .route("/:id")
  .get(phonesController.getSinglePhone)
  .patch(authController.protectRoute, authController.onlyForAdmin('admin'), phonesController.patchSinglePhone)
  .delete(authController.protectRoute, authController.onlyForAdmin('admin'), phonesController.deletePhone);

module.exports = router;
