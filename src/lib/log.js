const LOG_ENCOUNTER_START = "An encounter has started!"

const push = (encounter) => {
  return (str) => {
    wlog(str);
    encounter.log.push(str);
    return str;
  }
}

class Log {

  static encounter(encounter) {
    return new LogEncounter(encounter);
  }
}

class LogEncounter {

  constructor(encounter) {
    this.encounter = encounter;
    this.push      = push(this.encounter)
  }

  start() {
    return new Promise( (resolve, reject) => {
      resolve(this.push(LOG_ENCOUNTER_START));
    });
  }

  end() {
    return new Promise( (resolve, reject) => {
      this.encounter.get_living_party().then( (party) => {
        resolve(this.push(`${party.allegiance.toUpperCase()}'S party is victorious!`));
      });
    });
  }

  turn() {
    return new Promise( (resolve, reject) => {
      this.encounter.get_current_party().then( (party) => {
        this.encounter.get_current_actor().then( (actor) => {
          resolve(this.push(`>>> ${party.allegiance.toUpperCase()}'S TURN (${actor.name}) <<<`));
        });
      });
    });
  }

  action(action) {
    return new LogAction(this.encounter, action);
  }

}

class LogAction {

  constructor(encounter, action) {
    this.encounter = encounter;
    this.action    = action;
    this.push      = push(this.encounter);
  }

  apply() {
    return new Promise( (resolve, reject) => {
      this.action.value.ability_tmpl().then( (ability_tmpl) => {
        resolve(this.push(`${this.action.agent.get('name')} casts ${ability_tmpl.get('name')} on ${this.action.target.get('name')}`));
      });
    });
  }

  lethal() {
    return new Promise( (resolve, reject) => {
      this.action.value.ability_tmpl().then( (ability_tmpl) => {
        resolve(this.push(`${this.action.target.get('name')} has been slain!`));
      });
    });
  }

  effect(effect) {
    return new LogEffect(this.encounter, this.action, effect);
  }

}

class LogEffect {

  constructor(encounter, action, effect) {
    this.encounter = encounter;
    this.action    = action;
    this.effect    = effect;
    this.push      = push(this.encounter);
  }

  damage() {
    return new Promise( (resolve, reject) => {
      this.action.value.ability_tmpl().then( (ability_tmpl) => {
        resolve(this.push(`${this.action.target.get('name')} takes ${this.effect.value} damage from ${ability_tmpl.get('name')}`));
      });
    });
  }

}

module.exports = Log;
