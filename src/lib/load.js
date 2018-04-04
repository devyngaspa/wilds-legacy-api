function get_document(id, model, get=false) {
  return new Promise( (resolve, reject) => {
    if (get) {
      model.findById(id).then( (document) => {
        resolve(document);
      });
    }
    else { resolve(id); }
  });
}

function start_encounter(encounter) {
  return new Promise( (resolve, reject) => {
    if (encounter.current_turn === undefined || encounter.current_turn === null) {
      encounter.start().then( () => {
        resolve();
      });
    }
    else {
      resolve();
    }
  });
}

class Load {

  static encounter(params) {
    return new Promise( (resolve, reject) => {
      get_document(params, Encounter, (typeof params == 'string')).then( (encounter) => {
        start_encounter(encounter).then( () => {
          let hash = {
            actors:        encounter.get_actors(),
            parties:       encounter.parties(),
            current_actor: encounter.get_current_actor(),
            current_party: encounter.get_current_party(),
          }
          whelp.promise.hash(hash).then( (data) => {
            data.encounter    = encounter;
            if (data.current_party.is_allegiance_player()) {
              data.current_actor.get_performables().then( (performables) => {
                data.performables = performables;
                resolve(data);
              });
            }
            else {
              resolve(data);
            }

          });
        });
      });
    });
  }

  static player(params) {
    return new Promise( (resolve, reject) => {
      get_document(params, Player, (typeof params == 'string')).then( (player) => {
        player.fill_quests().then( () => {
          let hash = {
            encounter:   player.encounter(),
            expeditions: player.expeditions(),
            quests:      player.quests(),
            characters:  player.characters(),
          };
          whelp.promise.hash(hash).then( (data) => {
            let promises = data.characters.map((character) => { return whelp.model.find_many_by_id(Ability, character.ability_ids) });
            Promise.all(promises).then( (abilities) => {
              data.characters = data.characters.map((character, i) => { return Object.assign({}, character.toObject(), { abilities: abilities[i].map((ability) => { return ability.toObject() }) }) });
              data.player = player;
              resolve(data)
            });
          });
        });
      });
    });
  }

}

module.exports = Load;
