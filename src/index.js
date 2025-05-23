const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const Database = require("./services/Database");
const routes = require("./routes/index");
const router = express.Router();

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use(express.json());
routes.forEach((route) => {
  router[route.method](route.route, route.controller);
});

app.listen(port, () => {
  Database.getInstance();
  console.log("Database connection established");
  console.log(`Server is running on port ${port}`);
});
