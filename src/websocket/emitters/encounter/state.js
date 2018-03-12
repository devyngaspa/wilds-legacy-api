class EncounterStateEventEmitter extends WEventEmitter {

  update(data, options={}) {
    options.io.to(options.data.room).emit(WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE, data);
  }

};

module.exports = EncounterStateEventEmitter;
