class Decider {

  constructor (encounter, allegiance) {
    this.encounter  = encounter;
    this.allegiance = allegiance;
  }

  initialize() {
    return new Promise( (resolve, reject) => {
      this.encounter.parties().then( (parties) => {
        this.party          = whelp.find_by(parties, 'allegiance', this.allegiance);
        this.opposing_party = whelp.find_by(parties, 'allegiance', this.allegiance, true);
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
            resolve(Waction.generate('ability', abilities[0], actor, enemy));
          });
        });
      });
    });
  }

}
  
module.exports = Decider;
