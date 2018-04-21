const expedition_schema = Wdb.schema({
  start_time:    Date,
  end_time:      Date,
  xp:            Number,
  succeed:       Number,
  success:       Boolean,
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
      this.did_succeed().then( () => {
        this.apply_outcomes().then( () => {
          let promises = characters.map((character) => { return character.unoccupy() })
          Promise.all(promises).then(() => {
            this.complete().then(() => {
              resolve(this);
            });
          });
        });
      });
    });
  });
}

expedition_schema.methods.did_succeed = function () {
  let value    = this.succeed > whelp.rand.number(0, 1);
  this.success = value;
  return this.save()
}


expedition_schema.methods.get_duration = function () {
  return moment(this.end_time).diff(moment(this.start_time), 'seconds')
}

expedition_schema.methods.get_outcomes = function () {
  return new Promise( (resolve, reject) => {
    this.quest().then( (quest) => {
      quest.level().then( (level) => {
        this.characters().then( (characters) => {
          // HP damage
          let outcomes = characters.map((character) => { 
            let value = 
              Math.min(
                ((EXPEDITION_OUTCOMES.hp.damage.base_per_level[level.value]
                * (1 / this.succeed)
                * EXPEDITION_OUTCOMES.hp.damage.success_multiplier[this.success.toString()]
                * EXPEDITION_OUTCOMES.hp.damage.difficulty_multiplier[quest.difficulty]
                ) + whelp.array.sample(EXPEDITION_OUTCOMES.hp.damage.offset_per_level[level.value])),
                EXPEDITION_OUTCOMES.hp.damage.maximum_per_level[level.value]
              );
            return new Woutcome({type: 'hp', subject: character, value: value});
          });
          // WP damage
          outcomes = outcomes.concat(characters.map((character) => { 
            let value = 
              Math.min(
                (EXPEDITION_OUTCOMES.wp.damage.base_per_level[level.value]
                * EXPEDITION_OUTCOMES.wp.damage.duration_multiplier 
                * this.get_duration()
                ),
                EXPEDITION_OUTCOMES.wp.damage.maximum_per_level[level.value]
              );
            return new Woutcome({type: 'wp', subject: character, value: value});
          }));
          // XP
          outcomes = outcomes.concat(characters.map((character) => { 
            return new Woutcome({type: 'xp', subject: character, value: this.xp});
          }));
          //REWARDS

          resolve(outcomes);
        });
      });
    });
  });
}

expedition_schema.methods.apply_outcomes = function () {
  return new Promise( (resolve, reject) => {
    this.get_outcomes().then( (outcomes) => {
      let promises = outcomes.map((outcome) => { return outcome.apply() });
      Promise.all(promises).then( (results) => {
        resolve(results);
      });
    });
  });
}

expedition_schema.statics.mock = function (quest, characters) {
  return new Promise( (resolve, reject) => {
    quest.level().then( (quest_level) => {
      let promises = characters.map((character) => { return character.level(); })
      Promise.all(promises).then( (character_levels) => {
        promises = characters.map((character) => { return character.traits(); })
        Promise.all(promises).then( (traits) => {
          traits = whelp.array.flatten(traits);
          quest.threats().then( (threats) => {

            let uncountered_threats = threats.filter((threat) => { 
              let trait_ids = traits.map((trait) => { return trait.id; });
              return !threat.counter_ids.some((counter_id) => { return trait_ids.includes(counter_id); })
            });
            let average_character_level = Math.round(whelp.array.sum_by(character_levels, 'value')/(character_levels.length), 0)
            let level_difference = quest_level.value - average_character_level;
            let succeed =
              Math.min(Math.max(
                (EXPEDITION_MOCK.succeed.base_per_level[quest_level.value]
                * (characters.length*EXPEDITION_MOCK.succeed.difficulty_characters_multiplier[quest.difficulty])
                - (level_difference*EXPEDITION_MOCK.succeed.level_difference_multiplier)
                - (uncountered_threats.length*EXPEDITION_MOCK.succeed.uncountered_threats_multiplier)
                ), EXPEDITION_MOCK.succeed.minimum_per_level[quest_level.value]),
                EXPEDITION_MOCK.succeed.maximum_per_level[quest_level.value]);

            let combined_quickness = whelp.array.sum(characters
              .map((character) => { return character.stats.quickness }));

            let duration_reduction = Math.round(combined_quickness * EXPEDITION_MOCK.duration.difficulty_quickness_multiplier[quest.difficulty], 0);

            let duration =
              Math.floor(
                quest.duration 
                - duration_reduction
              );

            let obj = {
              succeed,
              duration,
              duration_reduction,
              quest_id: quest.id,
              character_ids: characters.map((character) => { return character.id })
            }
            resolve(obj)
          });
        });
      });
    });
  });
}

Expedition = mongoose.model('Expedition', expedition_schema);

module.exports = Expedition;
