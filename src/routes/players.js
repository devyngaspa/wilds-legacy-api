var express    = require('express');
var router     = express.Router();
var PlayersController = require('../controllers/player/players');

router.get('/load', function(request, response, next) {
  controller = new PlayersController(request, response, next);
  controller.load(request, response);
});

module.exports = { path: '/players', router };
