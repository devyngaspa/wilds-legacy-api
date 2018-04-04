class GamesController {

  constructor (request, response) {
    this.request  = request;
    this.response = response;
    this.params   = request.params;
  }

  load () {
    let promises = {
      ability_tmpls:   AbilityTmpl.find({}),
      character_tmpls: CharacterTmpl.find({}),
      item_tmpls:      ItemTmpl.find({}),
      monster_tmpls:   MonsterTmpl.find({}),
      quest_tmpls:     QuestTmpl.find({}),
      threats:         Threat.find({})
    }
    whelp.promise.hash(promises).then( (hash) => {
      this.response.json({game: hash});
    });
  }

}

module.exports = GamesController;
