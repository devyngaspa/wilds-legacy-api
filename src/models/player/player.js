const player_schema = Wdb.schema({
  name:           String,
  currency:       Number,
  encounter_id:   { type: mongoose.Schema.Types.ObjectId, ref: 'Encounter' },
  quest_ids:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  expedition_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expedition' }],
  character_ids:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }]
});

player_schema.methods.embark = function (quest, characters) {
  return new Promise( (resolve, reject) => {
    let now = moment()
    Expedition.create({
      quest_id:      quest.get('id'),
      character_ids: whelp.array.map_by(characters, 'id'),
      xp:            quest.get('xp')
    }).then( (expedition) => {
      expedition.start().then( () => {
        quest.deactivate().then( () => {
          resolve(expedition);
        });
      });
    });
  });
}

player_schema.methods.reset_quests = function () {
  return new Promise( (resolve, reject) => {
    Quest.remove({'_id': { $in: this.quest_ids}}).then( () => {
      this.fill_quests().then( () => {
        resolve();
      });
    });
  });
}

player_schema.methods.fill_quests = function () {
  return new Promise( (resolve, reject) => {
    this.quests().then( (quests) => {
      quests = whelp.array.filter_by(quests, 'state', 'active');
      // more than 3 quests, reset
      if (quests.length > 3) { 
        this.reset_quests().then( () => {
          resolve();
        })
      }
      else {
        let difficulties = [QUEST_DIFFICULTY_EASY, QUEST_DIFFICULTY_MEDIUM, QUEST_DIFFICULTY_HARD];
        let quests_by_difficulty = whelp.array.group_by(quests, 'difficulty');
        whelp.array.for_each(difficulties, (difficulty) => { quests_by_difficulty[difficulty] = quests_by_difficulty[difficulty] || []});

        // some difficulty has more than 1 quest, reset
        if (whelp.object.values(quests_by_difficulty).some((quests) => { return quests.length > 1 })) {
          this.reset_quests().then( () => {
            resolve();
          });
        }
        else {
          whelp.array.for_each(difficulties, (difficulty) => {
            if (quests_by_difficulty[difficulty].length === 1) { delete quests_by_difficulty[difficulty] }
          });
          let promises = Object.keys(quests_by_difficulty).map((difficulty) => { return Gen.quest({difficulty: difficulty, level: 1}, {player: this}) });

          Promise.all(promises).then( (new_quests) => {
            whelp.array.for_each(new_quests, (new_quest) => { this.quest_ids.push(new_quest.id) });
            this.save().then( () => {
              resolve();
            });
          });

        }

      }
    });
  });
}

Player = mongoose.model('Player', player_schema);

module.exports = Player;
