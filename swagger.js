
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerSpec = YAML.load("./swagger.yaml");

module.exports = { swaggerUi, swaggerSpec };