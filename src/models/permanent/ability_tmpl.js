const ability_tmpl_schema = Wdb.schema({
  name: String,
  description: String,
  target: String,
  effects: [mongoose.Schema.Types.Mixed]
});

AbilityTmpl = mongoose.model('AbilityTmpl', ability_tmpl_schema);

module.exports = AbilityTmpl;
