const WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE = require('../../events/emit/encounter/state/update')

class EncounterStateEventEmitter extends WEventEmitter {

  update(data) {
    io.to(this.options.data.room).emit(WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE, data);
  }

};

module.exports = EncounterStateEventEmitter;
