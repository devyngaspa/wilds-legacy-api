const battle_schema = Wdb.schema({
  actor_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }]
});

Battle = mongoose.model('Battle', battle_schema);

module.exports = Battle;
