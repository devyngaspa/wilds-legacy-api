CHARACTER_ROLE_LEADER  = 'leader';
CHARACTER_ROLE_FIGHTER = 'fighter';
CHARACTER_ROLE_SCOUT   = 'scout';
CHARACTER_ROLE_HEALER  = 'healer';

module.exports = {

  hp: {
    damage: {
      maximum_per_level: [0,5,6,9,11,13],

      base_per_level: [0,0.5,0.65,0.80,0.95,1.10],

      success_multiplier: {
        'true':  1,
        'false': 2.5
      },

      difficulty_multiplier: {
        'easy':   1,
        'medium': 1.5,
        'hard':   2
      },

      offset_per_level: [
        [0],
        [0,0,0,1,1,1.5],
        [0,0,0,1,1,1.5,1.5],
        [0,0,0,1,1,1,1.5,1.5,2],
        [0,0,0,1,1,1.5,1.5,1.5,2],
        [0,0,0,1,1,1.5,1.5,2,2],
      ]
    }
  },

  wp: {
    damage: {
      maximum_per_level:   [0,8,8,8,8,8],

      base_per_level:      [0,1,1,1,1,1],

      duration_multiplier: 0.0041666
    }
  }

}

