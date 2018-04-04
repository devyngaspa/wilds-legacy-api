const encounter_schema = Wdb.schema({
  party_ids:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Party' }],
  current_turn:     Number,
  turns:            [mongoose.Schema.Types.ObjectId],
  action_history:   [mongoose.Schema.Types.Mixed],
  log:              [String],
  encounter_states: [mongoose.Schema.Types.Mixed]
});

encounter_schema.methods.set_turns = function (actors) {
  this.turns = actors.map( (a) => { return a.get('id'); });
}

encounter_schema.methods.get_actors = function () {
  return whelp.model.find_many_by_id(Actor, this.turns, true)
}

encounter_schema.methods.get_current_actor = function () {
  return new Promise( (resolve, reject) => {
    let id = this.turns[this.current_turn];
    Actor.findById(id).then( (actor) => {
      resolve(actor);
    });
  });
}

encounter_schema.methods.get_current_party = function () {
  return new Promise( (resolve, reject) => {
    this.get_current_actor().then( (actor) => {
      this.parties().then( (parties) => {
        let party = parties.find((party) => { 
          return party.actor_ids.map((id) => { return id.toString(); }).includes(actor.get('id')); })
        resolve(party);
      });
    });
  });
}

encounter_schema.methods.get_living_party = function () {
  return new Promise( (resolve, reject) => {
    this.parties().then( (parties) => {
      let hash = {};
      parties.forEach( (party) => { hash[party.get('id')] = party.get_is_wipe(); })
      whelp.promise.hash(hash).then( (results) => {
        let id = null;
        Object.keys(results).forEach( (key) => {
          if (results[key]) { id = key; }
        });
        resolve(whelp.array.find_by(parties, 'id', id))
      });
    });
  });
}

encounter_schema.methods.push_action_history = function (action) {
  this.action_history.push(action);
}

encounter_schema.methods.push_encounter_state = function () {
  return new Promise( (resolve, reject) => {
    this.get_encounter_state().then( (state) => { 
      this.encounter_states.push(state); 
      resolve(this.encounter_states); 
    });
  });
}

encounter_schema.methods.get_current_state = function () { return (this.encounter_states.length - 1); }

encounter_schema.methods.get_is_ended = function() {
  return new Promise( (resolve, reject) => {
    this.parties().then( (parties) => {
      promises = parties.map( (party) => { return party.get_is_wipe(); });
      Promise.all(promises).then( (is_wipes) => {
        resolve(is_wipes.includes(true));
      });
    });
  });
}

encounter_schema.methods.increment_current_turn = function() { 
  this.current_turn = (this.current_turn + 1) % (this.turns.length);
}

encounter_schema.methods.get_encounter_state = function() {
  return new Promise( (resolve, reject) => {
    let obj = {};
    this.parties().then( (parties) => {
      obj.parties  = parties.map( (party) => { return party.toObject(); });
      let promises = parties.map( (party) => { return party.actors(); });
      Promise.all(promises).then( (actors) => {
        obj.actors         = whelp.array.flatten(actors).map( (actor) => { return actor.toObject(); });
        obj.current_turn   = this.current_turn;
        obj.turns          = this.turns.slice(0, this.turns.length);
        obj.action_history = this.action_history.slice(0, this.action_history.length).map( (action) => { return Object.assign({}, action); });
        resolve(obj);
      });
    });
  });
}

encounter_schema.methods.start = function() {
  return new Promise( (resolve, reject) => {
    this.current_turn = 0;
    this.parties().then( (parties) => {
      let promises = parties.map( (party) => { return party.actors(); });
      Promise.all(promises).then( (results) => {
        let actors = whelp.array.flatten(results);
        whelp.array.sort_by(actors, 'quickness');
        this.set_turns(actors);
        this.push_encounter_state().then( () => {
          Log.encounter(this).start().then( () => {
            this.save().then( () => {
              resolve();
            });
          });
        });
      });
    });
  });
}

encounter_schema.methods.end = function() {
  return new Promise( (resolve, reject) => {
    Log.encounter(this).end().then( () => {
      resolve();
    });
  });
}

encounter_schema.methods.perform = function(options) {
  return new Promise( (resolve, reject) => {
    Waction.generate(options).then( (action) => {
      action.apply(this).then( () => {
        this.push_action_history(action.action_history_object());
        this.save().then( () => {
          this.next_turn().then( () => {
            resolve();
          });
        });
      });
    },
    (error) => { reject(error); });
  });
}

encounter_schema.methods.next = function(options) {
  return new Promise( (resolve, reject) => {
    this.get_current_actor().then( (actor) => {
      if (actor.is_dead()) { 
        this.increment_current_turn();
        this.save().then( () => {
          this.next(options).then( () => {
            resolve();
          });
        });
      }
      else {
        this.get_current_party().then( (party) => {
          if (!party.is_allegiance_enemy()) { resolve(); }
          else {
            Decider.generate(this, 'enemy').then( (decider) => {
              decider.get_next_action().then( (next_action) => {
                this.perform(next_action).then( () => {
                  this.get_is_ended().then( (is_ended) => {
                    if (is_ended) { 
                      this.end().then( () => {
                        resolve()
                      });
                    }
                    else { resolve(); }
                  });
                });
              });
            });
          }
        });
      }
    });
  });
}

encounter_schema.methods.next_turn = function() {
  return new Promise( (resolve, reject) => {
    this.get_is_ended().then( (is_ended) => {
      if (is_ended) { 
        this.end().then( () => {
          resolve()
        });
      }
      else {
        this.increment_current_turn();
        this.get_current_actor().then( (actor) => {
          if (actor.is_dead()) { 
            this.next_turn().then( () => {
              resolve();
            });
          }
          else {
            this.push_encounter_state().then( () => {
              Log.encounter(this).turn().then( () => {
                this.save().then( () => {
                  resolve();
                });
              });
            });
          }
        });
      };
    });
  });
}



Encounter = mongoose.model('encounter', encounter_schema);

module.exports = Encounter;
