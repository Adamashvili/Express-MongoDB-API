const express = require("express");
const phonesController = require("../Controlers/phonesController")

const router = express.Router();


router
.route("/")
.get(phonesController.getAllPhones)
.post(phonesController.postNewPhone);

router
  .route("/:id")
  .get(phonesController.getSinglePhone)
  .patch(phonesController.patchSinglePhone)
  .delete(phonesController.deletePhone);

module.exports = router;
