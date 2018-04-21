const level_schema = Wdb.schema({
  xp_max: Number,
  value:  Number
});

Level = mongoose.model('Level', level_schema);

module.exports = Level;
