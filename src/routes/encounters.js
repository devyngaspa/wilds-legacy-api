var express    = require('express');
var router     = express.Router();
var EncountersController = require('../controllers/encounter/encounters');

router.get('/:id', function(request, response) {
  controller = new EncountersController(request, response);
  controller.show(request, response);
});

router.get('/:id/load', function(request, response) {
  controller = new EncountersController(request, response);
  controller.load(request, response);
});

router.get('/:id/start', function(request, response) {
  controller = new EncountersController(request, response);
  controller.start(request, response);
});

router.get('/:id/perform', function(request, response) {
  controller = new EncountersController(request, response);
  controller.perform(request, response);
});

module.exports = { path: '/encounters', router: router };
