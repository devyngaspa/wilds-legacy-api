var express        = require('express');
var router         = express.Router();
var AuthController = require('../controllers/account/auth');

router.get('/google', passport.authenticate('google', { scope: ['profile'] }), (request, response, next) => {
  let controller = new AuthController(request, response, next);
  controller.google();
});

router.get('/google/redirect', passport.authenticate('google'), (request, response, next) => {
  let controller = new AuthController(request, response, next);
  controller.redirect();
});

module.exports = { path: '/auth', router };
