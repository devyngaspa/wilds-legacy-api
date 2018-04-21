module.exports = {

  succeed: {
      maximum_per_level: [0,1,1,1,1,1],

      minimum_per_level: [0,.2,.2,.2,.2,.2],

      base_per_level: [0,1,1,1,1,1],

      success_multiplier: {
        'true':  1,
        'false': 2.5
      },

      difficulty_characters_multiplier: {
        'easy':   1,
        'medium': 0.5,
        'hard':   0.3333
      },

      level_difference_multiplier: 0.08,

      uncountered_threats_multiplier: 0.2

  },

  duration: {

    difficulty_quickness_multiplier: {
      'easy': .1,
      'medium': .2,
      'hard': .3
    }
    
  }

}

