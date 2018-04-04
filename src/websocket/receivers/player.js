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

};

module.exports = PlayerEventReceiver;
