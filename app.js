const express = require("express");
const cors = require("cors");
const fs = require("fs");

//!Routes
const phonesRouter = require('./Routes/phonesRouter')

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./public"))



app.use('/api/v1/phones', phonesRouter)

module.exports = app
