var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.json([
    {
      id: 1,
      username: 'developer'
    },
    {
      id: 2,
      username: 'player'
    }
  ]);
});

module.exports = { path: '/users', router: router };
