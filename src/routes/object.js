const {router} = require('express');
const rest = require('../controllers/rest');

objectRoutes = [
    {
        method: 'post',
        route: '/object',
        controller: rest.readAll('ObjectModel'),
    }
]