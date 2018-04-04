const quest_schema = Wdb.schema({
  duration:      Number,
  xp:            Number,
  level:         Number,
  difficulty:    String,
  objective:     String,
  state:         { type: String, default: 'active' },
  quest_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
  threat_ids:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threat' }],
});


quest_schema.statics.difficulty_xp_multiplier = function (difficulty) {
  let multipliers                = {};
  multipliers[DIFFICULTY_EASY]   = 1;
  multipliers[DIFFICULTY_MEDIUM] = 1.5;
  multipliers[DIFFICULTY_HARD]   = 2;
  return multipliers[difficulty];
}

quest_schema.statics.difficulty_duration_multiplier = function (difficulty) {
  let multipliers                = {};
  multipliers[DIFFICULTY_EASY]   = 1;
  multipliers[DIFFICULTY_MEDIUM] = 1.5;
  multipliers[DIFFICULTY_HARD]   = 2;
  return multipliers[difficulty];
}

quest_schema.statics.level_xp_multiplier = function (level) {
  return (level > 1 ? ((level + 1)/2) : level)
}

quest_schema.methods.deactivate = function () {
  this.state = 'inactive';
  return this.save();
}

Quest = mongoose.model('Quest', quest_schema);

module.exports = Quest;
