const player_schema = Wdb.schema({
  name: String,
  encounter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Encounter' },
});

Player = mongoose.model('Player', player_schema);

module.exports = Player;
