const WS_EMIT_EVENT_PLAYER_STATE_UPDATE    = require('../events/emit/player/state/update')
const WS_EMIT_EVENT_EXPEDITION_MOCK_UPDATE = require('../events/emit/expedition/mock/update')

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
        let timeout_ms = 5000;
        let callback = () => { expedition.end().then( (outcome) => { this._load_and_emit_update(player, options); })}
        if (expedition.end_time > new Date()) { callback() }
        else if (moment().diff(moment(expedition.end_time)) <= timeout_ms) {
          setTimeout(callback, moment().diff(expedition.end_time))
        }
      });
    });
  }

  mock (options={}) {
    Quest.findById(options.data.quest_id).then( (quest) => {
      whelp.model.find_many_by_id(Character, options.data.character_ids).then( (characters) => {
        Expedition.mock(quest, characters).then( (data) => {
          Emit.event(WS_EMIT_EVENT_EXPEDITION_MOCK_UPDATE, data, options);
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
