const WS_EMIT_EVENT_PLAYER_STATE_UPDATE = require('../../events/emit/player/state/update')

class PlayerStateEventEmitter extends WEventEmitter {

  update(data) {
    io.to(this.options.data.room).emit(WS_EMIT_EVENT_PLAYER_STATE_UPDATE, data);
  }

};

module.exports = PlayerStateEventEmitter;
