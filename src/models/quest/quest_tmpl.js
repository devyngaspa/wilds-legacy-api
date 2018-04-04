const quest_tmpl_schema = Wdb.schema({
  name:        String,
  description: String,
  objective:   String
});

QuestTmpl = mongoose.model('QuestTmpl', quest_tmpl_schema);

module.exports = QuestTmpl;
