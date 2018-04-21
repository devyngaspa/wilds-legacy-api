var express    = require('express');
var router     = express.Router();
var EncountersController = require('../controllers/encounter/encounters');

router.get('/:id', function(request, response, next) {
  controller = new EncountersController(request, response, next);
  controller.show(request, response);
});

router.get('/:id/load', function(request, response, next) {
  controller = new EncountersController(request, response, next);
  controller.load(request, response);
});

router.get('/:id/start', function(request, response, next) {
  controller = new EncountersController(request, response, next);
  controller.start(request, response);
});

router.get('/:id/perform', function(request, response, next) {
  controller = new EncountersController(request, response, next);
  controller.perform(request, response);
});

module.exports = { path: '/encounters', router };
