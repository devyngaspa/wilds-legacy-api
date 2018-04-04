var Player = require('../../models/player/player');

class PlayersController {

  constructor (request, response) {
    this.request  = request;
    this.response = response;
    this.params   = request.params;
  }

  index () {
    whelp.model.find_first(Player, {name: 'Player One'}).then( (player) => {
      this.response.json({ player });
    });
  }

}

module.exports = PlayersController;
