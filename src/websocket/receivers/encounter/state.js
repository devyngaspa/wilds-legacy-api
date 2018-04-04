const WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE = require('../../events/emit/encounter/state/update')

class EncounterStateEventReceiver extends WEventReceiver {

  next (options={}) {
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

  perform (options={}) {
    Encounter.findById(options.data.id).then( (encounter) => {
      Actor.findById(options.data.agent._id).then( (agent) => {
        Actor.findById(options.data.target._id).then( (target) => {
          Ability.findById(options.data.value._id).then( (value) => {
            Waction.generate({ type: options.data.type, value, agent, target }).then( (action) => {
              encounter.perform(action).then( () => {
                this._load_and_emit_update(encounter, options);
              });
            });
          });
        });
      });
    });
  }

  _load_and_emit_update (encounter, options) {
    Load.encounter(encounter).then( (data) => {
      Emit.event(WS_EMIT_EVENT_ENCOUNTER_STATE_UPDATE, data, options);
    });
  }

};

module.exports = EncounterStateEventReceiver;
