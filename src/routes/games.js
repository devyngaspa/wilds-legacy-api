var express         = require('express');
var router          = express.Router();
var GamesController = require('../controllers/game/games');

router.get('/load', function(request, response, next) {
  controller = new GamesController(request, response, next);
  controller.load();
});

module.exports = { path: '/game', router };
