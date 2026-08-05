const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { swaggerUi, swaggerSpec } = require("./swagger");



//!Routes
const phonesRouter = require('./Routes/phonesRouter')
const brandsRouter = require('./Routes/brandsRouter')

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));
app.use(express.json());
app.use(express.static("./public"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/phones', phonesRouter)
app.use("/api/v1/brands", brandsRouter)

module.exports = app
