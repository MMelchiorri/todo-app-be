const rest = require('../controllers/rest')
const usersModel = require('../schemas/Users')

usersRoutes = [
  {
    method: 'get',
    route: '/users',
    controller: rest.readAll(usersModel),
  },
  {
    method: 'post',
    route: '/users',
    controller: rest.insert(usersModel),
  },
  {
    method: 'get',
    route: '/users/:id',
    controller: rest.getById(usersModel),
  },
  {
    method: 'put',
    route: '/users/:id',
    controller: rest.put(usersModel),
  },
  {
    method: 'delete',
    route: '/users/:id',
    controller: rest.deleteById(usersModel),
  },
  {
    method: 'delete',
    route: '/users',
    controller: rest.deleteAll(usersModel),
  },
]

module.exports = usersRoutes
