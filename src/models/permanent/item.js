const item_schema = Wdb.schema({
  item_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemTmpl' }
});

Item = mongoose.model('Item', item_schema);

module.exports = Item;
