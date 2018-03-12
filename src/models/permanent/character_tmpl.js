const character_tmpl_schema = Wdb.schema({
  name: String,
  description: String
});

CharacterTmpl = mongoose.model('CharacterTmpl', character_tmpl_schema);

module.exports = CharacterTmpl;
