const evolution_schema = Wdb.schema({
  level_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
  from_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'CharacterTmpl' },
  to_ids:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'CharacterTmpl' }],
});

Evolution = mongoose.model('Evolution', evolution_schema);

module.exports = Evolution;
