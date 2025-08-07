const express = require("express");
const cors = require("cors");
const Database = require("./services/Database");
const dotenv = require("dotenv").config();
const routes = require("./routes/index");
const router = express.Router();
const errorMiddleware = require("./middlewares/errorMiddleware");
const RabbitMQ = require("./services/Rabbitmq");

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());

app.use(express.json());
routes.forEach((route) => {
  router[route.method](route.route, route.controller);
});

app.use(router);
app.use(errorMiddleware);

app.listen(port, () => {
  Database.getInstance();
  RabbitMQ.getInstance();
  console.log("Database connection established");
  console.log(`Server is running on port ${port}`);
});
