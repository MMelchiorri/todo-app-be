const rest = require("../controllers/rest");
const ObjectModel = require("../schemas/object");

objectRoutes = [
  {
    method: "get",
    route: "/object",
    controller: rest.readAll(ObjectModel),
  },
];

module.exports = objectRoutes;
