const WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE = require('../events/emit/encounter/state/update')

class EncounterEventReceiver extends WEventReceiver {

  join (options={}) {
    options.socket.join(options.data.room);
    Load.encounter(options.data.id).then( (data) => {
      Emit.event(WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE, data, options)
    });
  }

  leave (options={}) {
    options.socket.leave(options.data.room);
  }

};

module.exports = EncounterEventReceiver;
