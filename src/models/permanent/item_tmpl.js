const item_tmpl_schema = Wdb.schema({
  name:        String,
  description: String,
  type:        String,
  context:     String,
  effects:     [mongoose.Schema.Types.Mixed]
});

ItemTmpl = mongoose.model('ItemTmpl', item_tmpl_schema);

module.exports = ItemTmpl;
