const monster_tmpl_schema = Wdb.schema({
  name: String,
  description: String
});

MonsterTmpl = mongoose.model('MonsterTmpl', monster_tmpl_schema);

module.exports = MonsterTmpl;
