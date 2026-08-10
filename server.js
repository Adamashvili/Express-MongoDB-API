const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });


const app = require("./app");
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.HOST_CONN_STR)
  .then((successConnect) => {
    console.log("Database Connected Successfully!");
    app.listen(PORT,"0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    console.log("Something Wrong Happened...");
  });

