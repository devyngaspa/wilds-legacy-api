class EncounterStateEventReceiver extends WEventReceiver {

  increment (options={}) {
    Encounter.findById(options.data.id).then( (encounter) => {
      if (encounter.get_current_state() === options.data.state) {
        encounter.next().then( () => {
          this._load_and_emit_update(encounter, options);
        });
      }
      else {
        this._load_and_emit_update(encounter, options);
      }
    });
  }

  _load_and_emit_update (encounter, options) {
    Load.encounter(encounter).then( (data) => {
      Emit.event(WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE, data, options);
    });
  }

};

module.exports = EncounterStateEventReceiver;
