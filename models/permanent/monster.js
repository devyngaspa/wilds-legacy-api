const monster_schema = Wdb.schema({
  hp: Number,
  stats: {
    ferocity: Number,
    endurance: Number,
    knowledge: Number,
    resilience: Number
  },
  monster_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MonsterTmpl' },
  ability_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }]
});

Monster = mongoose.model('Monster', monster_schema);

module.exports = Monster;
