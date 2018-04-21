var express               = require('express');
var router                = express.Router();
var ExpeditionsController = require('../controllers/quest/expeditions');

router.post('/', function(request, response, next) {
  controller = new ExpeditionsController(request, response, next);
  controller.create();
});

module.exports = { path: '/expeditions', router };
