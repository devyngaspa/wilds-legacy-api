const threat_schema = Wdb.schema({
  name:        String,
  description: String,
  type:        String,
  level_id:    { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
  counter_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }],
});

Threat = mongoose.model('Threat', threat_schema);

module.exports = Threat;
