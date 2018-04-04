class Decider {

  static generate (...args) {
    return new Promise( (resolve, reject) => {
      let decider = new this(...args);
      decider.initialize().then( () => {
        resolve(decider);
      });
    });
  }

  constructor (encounter, allegiance) {
    this.encounter  = encounter;
    this.allegiance = allegiance;
  }

  initialize() {
    return new Promise( (resolve, reject) => {
      this.encounter.parties().then( (parties) => {
        this.party          = whelp.array.find_by(parties, 'allegiance', this.allegiance);
        this.opposing_party = whelp.array.find_by(parties, 'allegiance', this.allegiance, true);
        resolve()
      });
    });
  }

  get_opposing_actor () {
    return new Promise( (resolve, reject) => {
      this.opposing_party.actors().then( (actors) => {
        actors = actors.filter( (actor) => { return actor.get('hp') > 0.0; });
        resolve(actors[0]);
      });
    });
  }

  get_next_action () {
    return new Promise( (resolve, reject) => {
      this.encounter.get_current_actor().then( (actor) => {
        actor.abilities().then( (abilities) => {
          this.get_opposing_actor().then( (enemy) => {
            resolve(Waction.generate({type: 'ability', value: abilities[0], agent: actor, target: enemy}));
          });
        });
      });
    });
  }

}
  
module.exports = Decider;
