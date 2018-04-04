var express               = require('express');
var router                = express.Router();
var ExpeditionsController = require('../controllers/quest/expeditions');

router.post('/', function(request, response) {
  controller = new ExpeditionsController(request, response);
  controller.create();
});

module.exports = { path: '/expeditions', router: router };
