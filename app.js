const express = require("express");
const cors = require("cors");
const fs = require("fs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const { swaggerUi, swaggerSpec } = require("./swagger");



//!Routes
const phonesRouter = require('./Routes/phonesRouter')
const brandsRouter = require('./Routes/brandsRouter')
const authRouter = require('./Routes/authRouter')
const cartRouter = require('./Routes/cartRouter')

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

let limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 100,
  message: "You Have Reached Request limit, Come Back After 1 Hour."
})
app.use(helmet());
app.use("/api", limiter)
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    });
  }
  next();
});
app.use(express.json());

app.use(express.static("./public"))
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/phones', phonesRouter)
app.use("/api/v1/brands", brandsRouter)
app.use("/api/v1/users", authRouter)
app.use("/api/v1/cart", cartRouter)

module.exports = app
