const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { swaggerUi, swaggerSpec } = require("./swagger");



//!Routes
const phonesRouter = require('./Routes/phonesRouter')
const brandsRouter = require('./Routes/brandsRouter')
const authRouter = require('./Routes/authRouter')

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express.json());
app.use(express.static("./public"))
app.use("/shopping-phones", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/phones', phonesRouter)
app.use("/api/v1/brands", brandsRouter)
app.use("/api/v1/users", authRouter)
// app.use("*", (req, res, next) => {
//   status(404).json({
//     status: "failed",
//     message: `This URL on Server does not exist`
//   })
// })

module.exports = app
