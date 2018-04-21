const user_schema = Wdb.schema({
  oauth: {
    google_id: String
  },
  player_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }
});

user_schema.methods.get_or_create_player = function () {
  if (this.player_id) { return Player.findById(this.player_id) }
  else { 
    return new Promise( (resolve, reject) => {
      Level.find({ value: 1}).then( (level) => {
        Player.create({
          xp: 0,
          currency: 0,
          level_id: level._id
        }).then( (player) => {
          this.player_id = player._id;
          this.save().then( () => {
            resolve(player);
          });
        });
      });
    });
  }
}

User = mongoose.model('User', user_schema);

module.exports = User;
