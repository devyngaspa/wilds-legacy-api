const actor_schema = Wdb.schema({
  actorable: mongoose.Schema.Types.Mixed,
});

actor_schema.methods.set_actorable = function (type, id) {
  this.actorable.type = type
  this.actorable.id = id
  return this.save()
}

Actor = mongoose.model('Actor', actor_schema);

module.exports = Actor;
