const express = require("express");
const phonesController = require("../Controlers/phonesController");
const authController = require("../Controlers/authController");

const router = express.Router();
router
  .route("/")
  .get(phonesController.getAllPhones)
  .post(authController.protectRoute, phonesController.postNewPhone);

router
  .route("/:id")
  .get(phonesController.getSinglePhone)
  .patch(authController.protectRoute, phonesController.patchSinglePhone)
  .delete(authController.protectRoute, phonesController.deletePhone);

module.exports = router;
