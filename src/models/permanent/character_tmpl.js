const character_tmpl_schema = Wdb.schema({
  name:        String,
  description: String,
  attack_type: String,
  gender:      String,
  role:        String,
  stats: {
    ferocity:   Number,
    endurance:  Number,
    quickness:  Number,
    resilience: Number
  },
  level_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' }
});

CharacterTmpl = mongoose.model('CharacterTmpl', character_tmpl_schema);

module.exports = CharacterTmpl;
