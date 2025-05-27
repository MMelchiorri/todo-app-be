const rest = require("../controllers/rest");
const todosModel = require("../schemas/Todos");

todosRoutes = [
  {
    method: "get",
    route: "/todos",
    controller: rest.readAll(todosModel),
  },
  {
    method: "post",
    route: "/todos",
    controller: rest.insert(todosModel),
  },
  {
    method: "get",
    route: "/todos/:id",
    controller: rest.getById(todosModel),
  },
  {
    method: "put",
    route: "/todos/:id",
    controller: rest.put(todosModel),
  },
];

module.exports = todosRoutes;
