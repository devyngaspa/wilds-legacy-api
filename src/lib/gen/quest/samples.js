

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

  duration: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let base       = 60;
      let level      = params.level || samples.level || defaults.level;
      let difficulty = params.difficulty || samples.difficulty || defaults.difficulty;
      let dmult      = Quest.difficulty_duration_multiplier(difficulty);
      let computed   = base * dmult;
      resolve([{ value: computed }]);
    });
  },

  xp: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let base       = 50;
      let level      = params.level || samples.level || defaults.level;
      let difficulty = params.difficulty || samples.difficulty || defaults.difficulty;
      let dmult      = Quest.difficulty_xp_multiplier(difficulty);
      let lmult      = Quest.level_xp_multiplier(level);
      let computed   = base * dmult * lmult;
      let values     = whelp.array.times(3, () => { return { value: Math.floor(computed * whelp.rand.number(0.8, 1.2))}});
      resolve(values);
    });
  },

  threat_ids: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      Threat.find({}).then( (threats) => {
        let difficulty = params.difficulty || samples.difficulty || defaults.difficulty;
        let n = 0;
        switch (difficulty) {
          case DIFFICULTY_EASY:
            n = 1;
            break;
          case DIFFICULTY_MEDIUM:
            n = 2;
            break;
          case DIFFICULTY_HARD:
            n = 3;
            break;
          default:
            n = 1;
            break;
        }
        resolve([{value: whelp.array.sample(threats, n, false).map((threat) => { return threat._id })}])
      });
    });
  },

  difficulty: [
    { value: DIFFICULTY_EASY, weight: 3 },
    { value: DIFFICULTY_MEDIUM, weight: 2 },
    { value: DIFFICULTY_HARD, weight: 1 }
  ],

  objective: [
    { value: 'hunt', weight: 6 },
    { value: 'forage', weight: 6 },
    { value: 'explore', weight: 5 },
    { value: 'rescue', weight: 4 }
  ]

}
