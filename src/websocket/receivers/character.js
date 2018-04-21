const WS_EMIT_EVENT_PLAYER_STATE_UPDATE = require('../events/emit/player/state/update')

class CharacterEventReceiver extends WEventReceiver {

  activate (options={}) {
    Player.findById(options.data.player_id).then( (player) => {
      Character.findById(options.data.character_id).then( (character) => {
        character.activate().then( () => {
          this._load_and_emit_update(player, options);
        });
      });
    });
  }

  _load_and_emit_update (player, options) {
    Load.player(player).then( (data) => {
      Emit.event(WS_EMIT_EVENT_PLAYER_STATE_UPDATE, data, options);
    });
  }

};

module.exports = CharacterEventReceiver;
