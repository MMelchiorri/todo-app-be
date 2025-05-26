const rest = require("../controllers/rest");
const ObjectModel = require("../schemas/TodoObject");

objectRoutes = [
  {
    method: "get",
    route: "/object",
    controller: rest.readAll(ObjectModel),
  },
  {
    method: "post",
    route: "/object",
    controller: rest.insert(ObjectModel),
  },
  {
    method: "get",
    route: "/object/:_id",
    controller: rest.getById(ObjectModel),
  },
];

module.exports = objectRoutes;
