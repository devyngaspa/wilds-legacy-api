class Simulation {

  constructor (encounter) {
    this.encounter      = encounter;
    this.decider_player = new Decider(encounter, 'player');
    this.decider_enemy  = new Decider(encounter, 'enemy');
    this.decider_map    = {
      'player': this.decider_player,
      'enemy': this.decider_enemy
    };
    this.current_decider = null;
  }

  set_current_decider() {
    return new Promise( (resolve, reject) => {
      this.encounter.get_current_actor().then( (actor) => {
        Party.find({'actor_ids': actor.get('id')}).then( (party) => {
          this.current_decider = this.decider_map[party[0].allegiance]
          resolve()
        });
      });
    });
  }

  get_current_decider () { return this.current_decider; }

  start() {
    return new Promise( (resolve, reject) => {
      let deciders = [this.decider_player, this.decider_enemy];
      let promises = deciders.map( (d) => { return d.initialize(); });
      Promise.all(promises).then( () => {
        let encounter          = this.encounter;
        encounter.current_turn = 0;
        encounter.parties().then( (parties) => {
          promises = new Array();
          parties.forEach( (party) => {
            promises.push(party.actors());
          });
          Promise.all(promises).then( (results) => {
            let actors = whelp.flatten(results);
            whelp.sort_by(actors, 'quickness');
            encounter.set_turns(actors);
            encounter.push_encounter_state()
            encounter.save().then( () => {
              this.set_current_decider().then( () => {
                console.log("An encounter has started!");
                resolve();
              });
            });
          });
        });
      });
    });
  }

  proceed() {
    return new Promise( (resolve, reject) => {
      this.encounter.get_is_ended().then( (is_ended) => {
        if (is_ended) { 
          this.end_encounter().then( () => {
            resolve();
          });
        }
        else {
          this.encounter.get_current_actor().then( (actor) => {
            if (actor.is_dead()) { 
              this.end_turn().then( () => {
                this.proceed().then( () => {
                  resolve();
                });
              });
            }
            else {
              let decider = this.get_current_decider();
              console.log('[(' + decider.allegiance.toUpperCase() + ') ' + actor.get('name') + '\'s turn.]');
              decider.get_next_action().then( (next_action) => {
                this.perform(next_action).then( () => {
                  this.proceed().then( () => {
                    resolve();
                  });
                });
              });
            }
          });
        }
      });
    });
  }

  perform (action) {
    return new Promise( (resolve, reject) => {
      action.apply(this.encounter).then( () => {
        this.end_turn().then( () => {
          resolve();
        })
      });
    });
  }

  end_turn () {
    return new Promise( (resolve, reject) => {
      this.encounter.increment_current_turn();
      this.encounter.save().then( () => {
        this.set_current_decider().then( () => {
          resolve();
        });
      });
    });
  }

  end_encounter () {
    return new Promise( (resolve, reject) => {
      console.log("The encounter is over, the " + this.get_current_decider().allegiance + '\'s party has wiped!');
      resolve();
    });
  }

  go () {
    return new Promise( (resolve, reject) => {
      this.start().then( () => { this.proceed().then( () => { resolve(); }); });
    });
  }

}
  
module.exports = Simulation;
