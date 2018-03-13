var express    = require('express');
var router     = express.Router();
var PlayersController = require('../controllers/player/players');

router.get('/', function(request, response) {
  controller = new PlayersController(request, response);
  controller.index(request, response);
});

module.exports = { path: '/players', router: router };
