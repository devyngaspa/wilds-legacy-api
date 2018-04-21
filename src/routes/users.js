var express         = require('express');
var router          = express.Router();
var UsersController = require('../controllers/account/users');

router.get('/login', (request, response, next) => {
  let controller = new UsersController(request, response, next);
  controller.login();
});

router.post('/restore', (request, response, next) => {
  let controller = new UsersController(request, response, next);
  controller.restore();
});

module.exports = { path: '/users', router };
