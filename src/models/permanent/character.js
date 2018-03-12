const character_schema = Wdb.schema({
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

Character = mongoose.model('Character', character_schema);

module.exports = Character;
