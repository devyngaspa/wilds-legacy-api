const character_tmpl_schema = Wdb.schema({
  name:        String,
  description: String,
  attack_type: String,
  gender:      String,
  role:        String
});

CharacterTmpl = mongoose.model('CharacterTmpl', character_tmpl_schema);

module.exports = CharacterTmpl;
