function get_parties(player_party=null, enemy_party=null) {
  return new Promise( (resolve, reject) => {
    if (player_party && enemy_party) {
      resolve({player: player_party, enemy: enemy_party});
    }
    else {
      promises = {
        player: whelp.find_first(Party, {allegiance: 'player'}),
        enemy:  whelp.find_first(Party, {allegiance: 'enemy'})
      }

      whelp.promise_hash(promises).then( (results) => { resolve(results); });
    }
  });
}

class Simulate {

  static encounter(player_party=null, enemy_party=null) {
    return new Promise( (resolve, reject) => {
      get_parties(player_party, enemy_party).then( (parties) => {
        player_party = parties.player;
        enemy_party  = parties.enemy;

        Encounter.create({

            party_ids: [player_party.get('_id'), enemy_party.get('_id')]

          }).then( (encounter) => {
            resolve(new Simulation(encounter));
        });
      });
    });

  };

}

module.exports = Simulate;
