const rest = require("../controllers/rest");

objectRoutes = [
  {
    method: "get",
    route: "/object",
    controller: rest.readAll("ObjectModel"),
  },
];

module.exports = objectRoutes;
