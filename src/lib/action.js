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
      // let options = {
      //   type:   type,
      //   value:  value,
      //   agent:  agent,
      //   target: target
      // };
      resolve(new Waction(options));
    });
  }

  action_history_object () {
    obj = {};
    obj.type = this.type;
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
        // default:
        //   console.log("222", this.type);
        //   //throw error_undefined_action_type(this.type);
        //   reject();
      }
    });
  }

  apply_action_ability (encounter) {
    return new Promise( (resolve, reject) => {
      this.value.ability_tmpl().then( (ability_tmpl) => {
        console.log(this.agent.get('name') + ' casts ' + ability_tmpl.get('name') + ' on ' + this.target.get('name'));
        let effects  = ability_tmpl.get('effects').map( (e) => { return new Weffect(e); });
        this.apply_effects(effects[0], effects, encounter).then( () => {
          if (this.target.is_dead()) { console.log(this.target.get('name') + ' has been slain!'); }
          resolve();
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
