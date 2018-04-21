const WS_EMIT_EVENT_PLAYER_STATE_UPDATE = require('../events/emit/player/state/update')

class PlayerEventReceiver extends WEventReceiver {

  join (options={}) {
    options.socket.join(options.data.room);
    Load.player(options.data.id).then( (data) => {
      Emit.event(WS_EMIT_EVENT_PLAYER_STATE_UPDATE, data, options)
    });
  }

  leave (options={}) {
    options.socket.leave(options.data.room);
  }

  refresh_characters (options={}) {
    Player.findById(options.data.id).then( (player) => {
      player.refresh_characters().then( () => {
        Load.player(player).then( (data) => {
          Emit.event(WS_EMIT_EVENT_PLAYER_STATE_UPDATE, data, options);
        });
      });
    });
  }

};

module.exports = PlayerEventReceiver;
