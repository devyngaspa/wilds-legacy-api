const OUTCOME_TYPE_HP        = 'hp';
const OUTCOME_TYPE_WP        = 'wp';
const OUTCOME_TYPE_XP        = 'xp';
const OUTCOME_TYPE_CHARACTER = 'character';
const OUTCOME_TYPE_ITEM      = 'item';
const OUTCOME_TYPE_CURRENCY  = 'currency';

class Woutcome {

  constructor (options={}) {
    this.type    = null;
    this.subject = null;
    this.value   = null;
    whelp.object.set_from_options(this, options);
  }

  to_object () {
    return {
      type:    this.type,
      subject: this.subject,
      value:   this.value
    }
  }

  apply () {
    return new Promise( (resolve, reject) => {
      let promise = null;
      switch (this.type) {
        case OUTCOME_TYPE_HP:
          promise = this.apply_outcome_hp();
          break;
        case OUTCOME_TYPE_WP:
          promise = this.apply_outcome_wp();
          break;
        case OUTCOME_TYPE_XP:
          promise = this.apply_outcome_xp();
          break;
        case OUTCOME_TYPE_CURRENCY:
          promise = this.apply_outcome_currency();
          break;
        case OUTCOME_TYPE_CHARACTER:
          promise = this.apply_outcome_character();
          break;
        case OUTCOME_TYPE_ITEM:
          promise = this.apply_outcome_item();
          break;
        default:
          promise = new Promise( (resolve2, reject2) => { resolve2(); })

      }
      promise.then( (result) => {
        resolve(result)
      });
    });
  }

  apply_outcome_hp () {
    return new Promise( (resolve, reject) => {
      this.subject.damage('hp_current', this.value).then( (result) => {
        resolve(result);
      });
      resolve()
    });
  }

  apply_outcome_wp () {
    return new Promise( (resolve, reject) => {
      this.subject.damage('wp_current', this.value).then( (result) => {
        resolve(result);
      });
    });
  }

  apply_outcome_xp () {
    return new Promise( (resolve, reject) => {
      this.subject.experience(this.value).then( (result) => {
        resolve(result);
      });
    });
  }

  apply_outcome_currency () {
    return new Promise( (resolve, reject) => {
      this.subject.earn(this.value).then( (result) => {
        resolve(result);
      });
    });
  }

  apply_outcome_character () {
    return new Promise( (resolve, reject) => {
      this.subject.character_ids.push(this.value.id)
      this.value.activate().then( () => {
        resolve(this.subject);
      });
    });
  }

  apply_outcome_item () {
    return new Promise( (resolve, reject) => {
      this.subject.item_ids.push(this.value.id)
      resolve(this.subject);
    });
  }
}

module.exports = Woutcome;
