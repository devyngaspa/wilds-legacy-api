const ACTION_TYPE_ABILITY = 'ability';

function set_constants (klass) {
  klass.ACTION_TYPE_ABILITY = ACTION_TYPE_ABILITY;
}

function error_undefined_action_type (type) {
  return new WactionError('No action type \'' + type + '\'')
}

class WactionError {

  constructor (message) {
    return new Error(message);
  }
}

class Waction {

  constructor (options={}) {
    this.type   = null;
    this.value  = null;
    this.agent  = null;
    this.target = null;
    whelp.set_from_options(this, options);
    set_constants(this);
  }

  static generate(options={}) {
    return new Promise( (resolve, reject) => {
      if (!options.type) { return reject(error_undefined_action_type(options.type)); }
      resolve(new Waction(options));
    });
  }

  static to_performable(obj) {
    return new Promise( (resolve, reject) => {
      switch (obj.constructor.name) {
        case 'model':
          obj.ability_tmpl().then( (ability_tmpl) => {
            resolve({ 
              type:        'ability', 
              _id:         obj.get('id'),
              name:        ability_tmpl.get('name'), 
              description: ability_tmpl.get('description'),
              value:       obj,
              target_type: 'enemy'
            });
          });
      }
    });
  }

  action_history_object () {
    let obj   = {};
    obj.type  = this.type;
    obj.value = this.value.get('id')
    obj.agent = this.agent.get('id')
    if (this.target) { obj.target = this.target.get('id'); }
    return obj;
  }

  apply (encounter) {
    return new Promise( (resolve, reject) => {
      switch (this.type) {
        case this.ACTION_TYPE_ABILITY:
          this.apply_action_ability(encounter).then( () => {
            resolve();
          });
      }
    });
  }

  apply_action_ability (encounter) {
    return new Promise( (resolve, reject) => {
      this.value.ability_tmpl().then( (ability_tmpl) => {
        Log.encounter(encounter).action(this).apply().then( () => {
          let effects  = ability_tmpl.get('effects').map( (e) => { return new Weffect(e); });
          this.apply_effects(effects[0], effects, encounter).then( () => {
            if (this.target.is_dead()) { 
              Log.encounter(encounter).action(this).lethal().then( () => {
                resolve();
              });
            }
            else { resolve(); }
          });
        });
      });
    });
  }

  apply_effects (effect, effects, encounter) {
    return new Promise( (resolve, reject) => {
      effect.apply(this, encounter).then( () => {
        let i = effects.indexOf(effect);
        if (i === (effects.length - 1)) { resolve(); }
        else {
          let next_effect = effects[i + 1];
          this.apply_effects(next_effect, effects, encounter).then( () => {
            resolve();
          });
        }
      });
    });
  }


}

module.exports = Waction;
