const consumable_schema = Wdb.schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
});

Consumable = mongoose.model('Consumable', consumable_schema);

module.exports = Consumable;
