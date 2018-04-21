const character_schema = Wdb.schema({
  name:       String,
  gender:     String,
  role:       String,
  hp_current: Number,
  hp_max:     Number,
  wp_current: Number,
  wp_max:     Number,
  xp:         Number,
  state:      { type: String, default: 'inactive' },
  stats:      {
    ferocity:   Number,
    endurance:  Number,
    quickness:  Number,
    resilience: Number
  },
  occupation:        mongoose.Schema.Types.Mixed,
  level_id:          { type: mongoose.Schema.Types.ObjectId, ref: 'Level' },
  character_tmpl_id: { type: mongoose.Schema.Types.ObjectId, ref: 'CharacterTmpl' },
  ability_ids:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ability' }],
  trait_ids:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trait' }]
});

character_schema.methods.occupy = function (occupation) {
  return new Promise( (resolve, reject) => {
    this.occupation = {
      type: occupation.constructor.modelName,
      id:   occupation.id
    };
    this.save().then( () => {
      resolve()
    });
  });
}

character_schema.methods.unoccupy = function () {
  return new Promise( (resolve, reject) => {
    this.occupation = null;
    this.save().then( () => {
      resolve()
    });
  });
}

character_schema.methods.is_dead = function () {
  return this.hp_current <= 0 || this.wp_current <= 0
}

character_schema.methods.get_trait_for_role = function () {
  return new Promise( (resolve, reject) => {
    this.character_tmpl().then( (character_tmpl) => {
      whelp.model.find_first(Trait, {role: character_tmpl.role}).then( (trait) => {
        resolve(trait);
      });
    });
  });
}


character_schema.methods.activate = function () {
  this.state = 'active'
  return this.save()
}

character_schema.methods.decease = function () {
  this.state = 'deceased'
  return this.save()
}

character_schema.methods.birth = function () {
  return new Promise( (resolve, reject) => {
    this.get_trait_for_role().then( (trait) => {
      this.hp_max     = CHARACTER_GROWTH.hp_base + CHARACTER_GROWTH.hp_per_endurance * this.stats.endurance;
      this.hp_current = this.hp_max;
      this.wp_max     = CHARACTER_GROWTH.wp_base + CHARACTER_GROWTH.wp_per_resilience * this.stats.resilience;
      this.wp_current = this.wp_max;
      this.xp         = 0;
      this.occupied   = null;
      this.state      = this.state || 'inactive';
      this.trait_ids.push(trait._id);
      this.save().then( () => {
        resolve(this);
      });
    });
  });
}

character_schema.methods.set_stats_from_character_tmpl = function (character_tmpl) {
  return new Promise( (resolve, reject) => {
    this.character_tmpl().then( (current_character_tmpl) => {
      whelp.array.for_each(CHARACTER_STATS, (key) => {
        let difference  = this.stats[key] - current_character_tmpl.stats[key];
        let new_value   = character_tmpl.stats[key] + difference;
        this.stats[key] = new_value;
      });
      this.hp_max     = CHARACTER_GROWTH.hp_base + CHARACTER_GROWTH.hp_per_endurance * this.stats.endurance;
      this.hp_current = this.hp_max;
      this.wp_max     = CHARACTER_GROWTH.wp_base + CHARACTER_GROWTH.wp_per_resilience * this.stats.resilience;
      this.wp_current = this.wp_max;
      this.save().then( () => {
        resolve(this);
      },
      (error) => { reject(error); })
    },
    (error) => { reject(error); })
  });
}

character_schema.methods.damage = function (type, value) {
  this[type] = Math.floor(this[type] - value);
  if (this.is_dead()) { return this.decease(); }
  else { return this.save(); }
}

character_schema.methods.experience = function (value) {
  return new Promise( (resolve, reject) => {
    this.xp = Math.floor(this.xp + value);
    this.save().then( () => {
      this.level_up().then( () => {
        resolve();
      });
    });
  });
}

character_schema.methods.level_up = function () {
  return new Promise( (resolve, reject) => {
    this.level().then( (level) => {
      whelp.model.find_first(Level, {value: (level.value + 1)}).then( (next_level) => {
        if (this.xp > level.xp_max) {
          this.level_id = next_level._id;
          this.save().then( () => {
            this.evolve().then( () => {
              resolve();
            });
          });
        }
        else { resolve(); }
      });
    });
  });
}

character_schema.methods.evolve = function () {
  return new Promise( (resolve, reject) => {
    whelp.model.find_first(Evolution, {from_id: this.character_tmpl_id, level_id: this.level_id}).then( (evolution) => {
      if (evolution) {
        whelp.model.find_many_by_id(CharacterTmpl, evolution.to_ids).then( (character_tmpls) => {
          let new_character_tmpl = whelp.array.sample(character_tmpls);
          let obj = {
            subject: this,
            from:    this.character_tmpl_id,
            to:      new_character_tmpl._id
          }
          this.set_stats_from_character_tmpl(new_character_tmpl).then( () => {
            this.character_tmpl_id = new_character_tmpl._id;
            this.save().then( () => {
              resolve();
            });
          });
        });
      }
      else { resolve(); }
    });
  });
}


Character = mongoose.model('Character', character_schema);

module.exports = Character;
