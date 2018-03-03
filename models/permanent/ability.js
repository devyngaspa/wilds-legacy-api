const ability_schema = Wdb.schema({
  ability_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'AbilityTmpl' }
});

Ability = mongoose.model('Ability', ability_schema);

module.exports = Ability;
