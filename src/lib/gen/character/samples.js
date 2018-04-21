const stat = (key, defaults={}, samples={}, params={}, options={}) => {
  return new Promise( (resolve, reject) => {
    let character_tmpl_id = params.character_tmpl_id || samples.character_tmpl_id || defaults.character_tmpl_id;
    CharacterTmpl.findById(character_tmpl_id).then( (character_tmpl) => {
      let value = character_tmpl.stats[key] + whelp.array.sample([0,0,0,1,1,1,2,2,3]);
      resolve([{ value: value }]);
    });
  });
}

module.exports = {

  name: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let gender           = params.gender || samples.gender || defaults.gender
      let first_name       = whelp.array.sample(CHARACTER_NAMES.first_names[gender]);
      let last_name_prefix = whelp.array.sample(CHARACTER_NAMES.last_names.prefixes);
      let last_name_suffix = whelp.array.sample(CHARACTER_NAMES.last_names.suffixes);
      let last_name        = last_name_prefix + last_name_suffix.toLowerCase();
      resolve([{value: `${first_name} ${last_name}`}]);
    });
  },

  gender: [
    { value: CHARACTER_GENDER_FEMALE },
    { value: CHARACTER_GENDER_MALE }
  ],

  character_tmpl_id: (defaults={}, samples={}, params={}, options={}) => {
    return new Promise( (resolve, reject) => {
      let gender   = params.gender || samples.gender || defaults.gender;
      let level_id = params.level_id || samples.level_id || defaults.level_id
      Level.findById(level_id).then( (level) => {
        Level.find({value: {$lte: level.value}}).then( (levels) => {
          CharacterTmpl.find({gender: gender, level_id: {$in: levels.map((lvl) => { return lvl._id; })}}).then( (character_tmpls) => {
            let results = character_tmpls.map((character_tmpl) => { return { value: character_tmpl._id }});
            resolve(results);
          });
        });
      });
    });
  },

  'stats.ferocity': (defaults={}, samples={}, params={}, options={}) => {
    return stat(CHARACTER_STAT_FEROCITY, defaults, samples, params, options);
  },

  'stats.endurance': (defaults={}, samples={}, params={}, options={}) => {
    return stat(CHARACTER_STAT_ENDURANCE, defaults, samples, params, options);
  },

  'stats.quickness': (defaults={}, samples={}, params={}, options={}) => {
    return stat(CHARACTER_STAT_QUICKNESS, defaults, samples, params, options);
  },

  'stats.resilience': (defaults={}, samples={}, params={}, options={}) => {
    return stat(CHARACTER_STAT_RESILIENCE, defaults, samples, params, options);
  }

}
