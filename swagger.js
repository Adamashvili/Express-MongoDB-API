const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Phone Store API",
      version: "1.0.0",
      description: "Phone products REST API, Made by Irakli Adamashvili",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"], // შენი routes ფაილები
};

module.exports = swaggerJsdoc(options);