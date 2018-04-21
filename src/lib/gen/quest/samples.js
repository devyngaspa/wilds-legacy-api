

module.exports = {

  quest_tmpl_id: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let objective = params.objective || samples.objective || defaults.objective;
      QuestTmpl.find({objective: objective}).then( (quest_tmpls) => {
        options.player.quests().then( (quests) => {
          quests      = whelp.array.filter_by(quests, 'state', 'active')
          let ids     = quests.map((quest) => { return quest.quest_tmpl_id.toString() })
          quest_tmpls = quest_tmpls.filter((quest_tmpl) => { return !ids.includes(quest_tmpl.id)})
          let results = quest_tmpls.map((quest_tmpl) => { return { value: quest_tmpl._id }});
          resolve(results);
        });
      });
    });
  },

  rewards: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let level_id = params.level_id || samples.level_id || defaults.level_id;
      Level.findById(level_id).then( (level) => {

        let objective  = params.objective || samples.objective || defaults.objective;
        let difficulty = params.difficulty || samples.difficulty || defaults.difficulty;

        switch (objective) {
          case QUEST_OBJECTIVE_HUNT:
            let base     = 20;
            let dmult    = Quest.difficulty_currency_multiplier(difficulty);
            let lmult    = Quest.level_currency_multiplier(level.value);
            let computed = base * dmult * lmult;
            let values   = whelp.array.times(3, () => { return { value: [{type: 'currency', value: Math.floor(computed * whelp.rand.number(0.8, 1.2))}]}});
            resolve(values);
            break;

          case QUEST_OBJECTIVE_FORAGE:
            ItemTmpl.find({type: ITEM_TMPL_TYPE_CONSUMABLE}).then( (item_tmpls) => {
              let quantity = 2
              switch (difficulty) {
                case QUEST_DIFFICULTY_EASY:
                  quantity = 2;
                  break;
                case QUEST_DIFFICULTY_MEDIUM:
                  quantity = 2;
                  break;
                case QUEST_DIFFICULTY_HARD:
                  quantity = 3;
                  break;
              }
              let values = [{ value: whelp.array.sample(item_tmpls, quantity, false).map((item_tmpl) => { return {type: item_tmpl.constructor.modelName, id: item_tmpl.id }})}];
              resolve(values);
            })
            break;

          case QUEST_OBJECTIVE_EXPLORE:
            ItemTmpl.find({type: ITEM_TMPL_TYPE_PERMANENT}).then( (item_tmpls) => {
              let quantity = 1
              switch (difficulty) {
                case QUEST_DIFFICULTY_EASY:
                  quantity = 1;
                  break;
                case QUEST_DIFFICULTY_MEDIUM:
                  quantity = 1;
                  break;
                case QUEST_DIFFICULTY_HARD:
                  quantity = 2;
                  break;
              }
              let values = [{ value: whelp.array.sample(item_tmpls, quantity, false).map((item_tmpl) => { return {type: item_tmpl.constructor.modelName, id: item_tmpl.id }})}];
              resolve(values);
            })
            break;

          case QUEST_OBJECTIVE_RESCUE:
            Gen.character({state: 'recruitable', level_id: level_id}, options).then( (character) => {
              let values = [{value: [{ type: character.constructor.modelName, id: character.id }]}];
              resolve(values);
            })
            break;
          }
      });
    });
  },

  duration: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let base       = 10;
      let difficulty = params.difficulty || samples.difficulty || defaults.difficulty;
      let dmult      = Quest.difficulty_duration_multiplier(difficulty);
      let computed   = base * dmult;
      resolve([{ value: computed }]);
    });
  },

  xp: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let level_id = params.level_id || samples.level_id || defaults.level_id;
      Level.findById(level_id).then( (level) => {
        let base       = 50;
        let difficulty = params.difficulty || samples.difficulty || defaults.difficulty;
        let dmult      = Quest.difficulty_xp_multiplier(difficulty);
        let lmult      = Quest.level_xp_multiplier(level.value);
        let computed   = base * dmult * lmult;
        let values     = whelp.array.times(3, () => { return { value: Math.floor(computed * whelp.rand.number(0.8, 1.2))}});
        resolve(values);
      });
    });
  },

  threat_ids: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let level_id = params.level_id || samples.level_id || defaults.level_id;
      Level.findById(level_id).then( (level) => {
        Level.find({value: {$lte: level.value}}).then( (levels) => {
          Threat.find({'level_id': { $in: levels.map((lvl) => { return lvl._id }) }}).then( (threats) => {
            let difficulty = params.difficulty || samples.difficulty || defaults.difficulty;
            let n =
              Math.min(
                (QUEST_THREATS.number.base_per_level[level.value]
                + QUEST_THREATS.number.difficulty_add[difficulty]),
                QUEST_THREATS.number.maximum_per_level[level.value],
                threats.length
              )

            resolve([{value: whelp.array.sample(threats, n, false).map((threat) => { return threat._id })}])
          });
        });
      });
    });
  },

  difficulty: [
    { value: QUEST_DIFFICULTY_EASY, weight: 3 },
    { value: QUEST_DIFFICULTY_MEDIUM, weight: 2 },
    { value: QUEST_DIFFICULTY_HARD, weight: 1 }
  ],

  objective: [
    { value: QUEST_OBJECTIVE_HUNT, weight: 6 },
    { value: QUEST_OBJECTIVE_FORAGE, weight: 6 },
    { value: QUEST_OBJECTIVE_EXPLORE, weight: 5 },
    { value: QUEST_OBJECTIVE_RESCUE, weight: 4 }
  ]

}
