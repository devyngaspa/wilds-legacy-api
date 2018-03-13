const actor_schema = Wdb.schema({
  actorable: mongoose.Schema.Types.Mixed,
  name: String,
  hp: Number,
  stats: {
    ferocity: Number,
    endurance: Number,
    knowledge: Number,
    quickness: Number,
    resilience: Number
  },
  character_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CharacterTmpl' },
  ability_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }]
});

actor_schema.methods.set_actorable = function (type, id) {
  this.actorable.type = type
  this.actorable.id = id
  return this.save()
}

actor_schema.methods.get_actorable = function (type, id) {
  model = whelp.constantize_model(this.actorable.type);
  return model.findById(this.actorable.id);
}

actor_schema.methods.is_dead = function () {
  return this.hp <= 0.0;
}

actor_schema.methods.get_performables = function () {
  return new Promise( (resolve, reject) => {
    this.abilities().then( (abilities) => {
      let promises = abilities.map( (ability) => { return Waction.to_performable(ability); });
      Promise.all(promises).then( (performables) => {
        resolve(performables);
      });
    });
  });
}

Actor = mongoose.model('Actor', actor_schema);

module.exports = Actor;
