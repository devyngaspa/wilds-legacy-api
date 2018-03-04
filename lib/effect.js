const EFFECT_TYPE_DAMAGE = 'damage';

function set_constants (klass) {
  klass.EFFECT_TYPE_DAMAGE = EFFECT_TYPE_DAMAGE;
}

class Weffect {

  constructor (options={}) {
    this.type     = null;
    this.value    = null;
    this.duration = null;
    whelp.set_from_options(this, options);
    set_constants(this);
  }

  apply (action, encounter) {
    return new Promise( (resolve, reject) => {
      switch (this.type) {
        case this.EFFECT_TYPE_DAMAGE:
          this.apply_effect_damage(action, encounter).then( () => {
            resolve();
          });
      }
    });
  }

  apply_effect_damage (action, encounter) {
    return new Promise( (resolve, reject) => {
      let hp = action.target.get('hp') - this.value;
      action.target.set('hp', hp);
      action.target.save().then( () => {
        console.log(action.target.get('name') + ' takes ' + this.value + ' damage, leaving them at ' + action.target.get('hp') + ' HP');
        resolve();
      });
    });
  }

}

module.exports = Weffect;
