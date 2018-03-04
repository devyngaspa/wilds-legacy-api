const encounter_schema = Wdb.schema({
  party_ids:        [{ type: mongoose.Schema.Types.ObjectId, ref: 'Party' }],
  current_turn:     Number,
  turns:            [mongoose.Schema.Types.ObjectId],
  action_history:   [mongoose.Schema.Types.Mixed],
  encounter_states: [mongoose.Schema.Types.Mixed]
});

encounter_schema.methods.set_turns = function (actors) {
  this.turns = actors.map( (a) => { return a.get('id'); });
}

encounter_schema.methods.get_current_actor = function () {
  return new Promise( (resolve, reject) => {
    id = this.turns[this.current_turn];
    Actor.findById(id).then( (actor) => {
      resolve(actor);
    });
  });
}

encounter_schema.methods.push_action_history = function (action) {
  this.action_history.push(action);
}

encounter_schema.methods.push_encounter_state = function () {
  this.encounter_states.push(this.toObject());
}

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

Encounter = mongoose.model('encounter', encounter_schema);

module.exports = Encounter;
