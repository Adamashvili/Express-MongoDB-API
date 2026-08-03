// const express = require("express");
// const phonesController = require("../Controlers/phonesController")

// const router = express.Router();

// router
// .route("/")
// .get(phonesController.getAllPhones)
// .post(phonesController.postNewPhone);

// router
//   .route("/:id")
//   .get(phonesController.getSinglePhone)
//   .patch(phonesController.patchSinglePhone)
//   .delete(phonesController.deletePhone);

// module.exports = router;




const express = require("express");
const phonesController = require("../Controlers/phonesController");

const router = express.Router();

// SWAGGER UI for  /phones
//
/**
 * @swagger
 * /phones:
 *   get:
 *     summary: Get all phones or filtered
 *     tags: [Phones]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter by brand
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Failed
 *   post:
 *     summary: Create new phone
 *     tags: [Phones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               color:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Failed
 */
router
  .route("/")
  .get(phonesController.getAllPhones)
  .post(phonesController.postNewPhone);

  
// SWAGGER UI for /phones/{id}
//
/**
 * @swagger
 * /phones/{id}:
 *   get:
 *     summary: Get single phone
 *     tags: [Phones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Phone ID
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update phone
 *     tags: [Phones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Phone ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               color:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete phone
 *     tags: [Phones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Phone ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
router
  .route("/:id")
  .get(phonesController.getSinglePhone)
  .patch(phonesController.patchSinglePhone)
  .delete(phonesController.deletePhone);

module.exports = router;