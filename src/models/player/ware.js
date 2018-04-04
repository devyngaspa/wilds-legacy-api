const ware_schema = Wdb.schema({
  quantity: Number,
  item_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemTmpl' }
});

Ware = mongoose.model('Ware', ware_schema);

module.exports = Ware;
