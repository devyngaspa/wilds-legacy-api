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
    this.show_combat_text = false;
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

  combat_text_on () { this.show_combat_text = true; }
  combat_text_off () { this.show_combat_text = false; }

  ct_print_encounter_start () { if (this.show_combat_text) { wlog("An encounter has started!"); }}
  ct_print_encounter_end () { if (this.show_combat_text) { wlog("The encounter is over, the " + this.get_current_decider().allegiance + '\'s party has wiped!'); }}

  ct_print_turn_begin (decider, actor) { if (this.show_combat_text) { wlog('[(' + decider.allegiance.toUpperCase() + ') ' + actor.get('name') + '\'s turn.]'); }}

  ct_print_damage (actor, value, hp) { if (this.show_combat_text) { wlog(actor.get('name') + ' takes ' + value + ' damage, leaving them at ' + hp + ' HP'); }}
  
  start() {
    return new Promise( (resolve, reject) => {
      let deciders = [this.decider_player, this.decider_enemy];
      let promises = deciders.map( (d) => { return d.initialize(); });
      Promise.all(promises).then( () => {
        this.encounter.start().then( () => {
          this.set_current_decider().then( () => {
            this.ct_print_encounter_start();
            resolve();
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
                setTimeout(() => {
                  this.proceed().then( () => {
                    resolve();
                  });
                }, 1500);
              });
            }
            else {
              let decider = this.get_current_decider();
              this.ct_print_turn_begin(decider, actor);
              decider.get_next_action().then( (next_action) => {
                this.perform(next_action).then( () => {
                  setTimeout(() => {
                    this.proceed().then( () => {
                      resolve();
                    });
                  }, 1500);
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
        this.encounter.push_action_history(action.action_history_object());
        this.encounter.save().then( () => {
          this.end_turn().then( () => {
            resolve();
          });
        });
      });
    });
  }

  end_turn () {
    return new Promise( (resolve, reject) => {
      this.encounter.next_turn().then( () => {
        this.set_current_decider().then( () => {
          resolve();
        });
      });
    });
  }

  end_encounter () {
    return new Promise( (resolve, reject) => {
      this.ct_print_encounter_end();
      console.log(this.encounter);
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
