var express         = require('express');
var router          = express.Router();
var GamesController = require('../controllers/game/games');

router.get('/load', function(request, response) {
  controller = new GamesController(request, response);
  controller.load(request, response);
});

module.exports = { path: '/game', router: router };
