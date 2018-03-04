const party_schema = Wdb.schema({
  actor_ids:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
  allegiance:     String
});

party_schema.methods.get_is_wipe = function () {
  return new Promise( (resolve, reject) => {
    this.actors().then( (actors) => {
      resolve(whelp.map_by(actors, 'hp').every( (hp) => { return hp <= 0.0; }));
    });
  });
}

Party = mongoose.model('party', party_schema);

module.exports = Party;