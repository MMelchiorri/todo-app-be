const rest = require("../controllers/rest");
const usersModel = require("../schemas/Users");

todosRoutes = [
  {
    method: "get",
    route: "/users",
    controller: rest.readAll(usersModel),
  },
  {
    method: "post",
    route: "/todos",
    controller: rest.insert(usersModel),
  },
  {
    method: "get",
    route: "/todos/:id",
    controller: rest.getById(usersModel),
  },
  {
    method: "put",
    route: "/todos/:id",
    controller: rest.put(usersModel),
  },
  {
    method: "delete",
    route: "/todos/:id",
    controller: rest.deleteById(usersModel),
  },
];

module.exports = todosRoutes;
