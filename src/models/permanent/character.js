const character_schema = Wdb.schema({
  name:       String,
  hp_current: Number,
  hp_max:     Number,
  wp_current: Number,
  wp_max:     Number,
  xp:         Number,
  state:      { type: String, default: 'inactive' },
  stats:      {
    ferocity:   Number,
    endurance:  Number,
    knowledge:  Number,
    quickness:  Number,
    resilience: Number
  },
  occupation:        mongoose.Schema.Types.Mixed,
  character_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CharacterTmpl' },
  ability_ids:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }]
});

character_schema.methods.occupy = function (occupation) {
  return new Promise( (resolve, reject) => {
    this.occupation = {
      type: occupation.constructor.modelName,
      id:   occupation.id
    };
    this.save().then( () => {
      resolve()
    });
  });
}

character_schema.methods.unoccupy = function () {
  return new Promise( (resolve, reject) => {
    this.occupation = null;
    this.save().then( () => {
      resolve()
    });
  });
}

character_schema.methods.activate = function () {
  this.state = 'active'
  return this.save()
}

character_schema.methods.decease = function () {
  this.state = 'deceased'
  return this.save()
}


Character = mongoose.model('Character', character_schema);

module.exports = Character;
