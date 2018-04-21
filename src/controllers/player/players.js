const Player = require('../../models/player/player');
const BaseController = require('../base')

class PlayersController extends BaseController {

  load () {
    let user_id = this.request.query.user_id;
    User.findById(user_id).then( (user) => {
      user.get_or_create_player().then( (player) => {
        this.response.json({ player });
      });
    });
  }

}

module.exports = PlayersController;
