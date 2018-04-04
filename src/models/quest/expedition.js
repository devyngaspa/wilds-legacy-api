const expedition_schema = Wdb.schema({
  start_time:    Date,
  end_time:      Date,
  xp:            Number,
  state:         { type: String, default: 'inactive' },
  character_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
  quest_id:      { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }
});

expedition_schema.methods.activate = function () {
  this.state = 'active'
  return this.save()
}

expedition_schema.methods.complete = function () {
  this.state = 'complete'
  return this.save()
}

expedition_schema.methods.start = function () {
  return new Promise( (resolve, reject) => {
    this.quest().then( (quest) => {
      this.characters().then( (characters) => {
        let promises = characters.map((character) => { return character.occupy(this) })
        Promise.all(promises).then(() => {
          let now         = moment();
          this.start_time = now.toDate(),
          this.end_time   = moment(this.start_time).add(quest.duration, 's').toDate()
          this.activate().then( () => {
            resolve(this);
          });
        });
      });
    });
  });
}

expedition_schema.methods.end = function () {
  return new Promise( (resolve, reject) => {
    this.characters().then( (characters) => {
      let promises = characters.map((character) => { return character.unoccupy() })
      Promise.all(promises).then(() => {
        this.complete().then(() => {
          resolve(this);
        });
      });
    });
  });
}

Expedition = mongoose.model('Expedition', expedition_schema);

module.exports = Expedition;
