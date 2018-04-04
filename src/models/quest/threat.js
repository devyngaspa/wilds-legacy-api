const threat_schema = Wdb.schema({
  name: String,
  description: String,
  counter_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AbilityTmpl' }],
});

Threat = mongoose.model('Threat', threat_schema);

module.exports = Threat;
