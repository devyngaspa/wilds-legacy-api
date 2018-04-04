const WS_EMIT_EVENT_PLAYER_STATE_UPDATE = require('../events/emit/player/state/update')

class ExpeditionEventReceiver extends WEventReceiver {

  start (options={}) {
    Player.findById(options.data.player_id).then( (player) => {
      Quest.findById(options.data.quest_id).then( (quest) => {
        whelp.model.find_many_by_id(Character, options.data.character_ids).then( (characters) => {
          player.embark(quest, characters).then( (expedition) => {
            this._load_and_emit_update(player, options);
          });
        });
      });
    });
  }

  complete (options={}) {
    Player.findById(options.data.player_id).then( (player) => {
      Expedition.findById(options.data.id).then( (expedition) => {
        expedition.end().then( () => {
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

module.exports = ExpeditionEventReceiver;
