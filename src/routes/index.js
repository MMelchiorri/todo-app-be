const TodoRoute = require("./todos");
const UserRoute = require("./user");

module.exports = [...TodoRoute, ...UserRoute];
