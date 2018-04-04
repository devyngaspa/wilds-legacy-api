const Quest      = require('../../models/quest/quest');
const Expedition = require('../../models/quest/expedition');
const Character  = require('../../models/permanent/character');
const WS_EMIT_EVENT_PLAYER_STATE_UPDATE = require('../../websocket/events/emit/player/state/update')

class ExpeditionsController {

  constructor (request, response) {
    this.request  = request;
    this.response = response;
    this.params   = request.params;
  }

  create () {
    let quest_id      = this.request.body.quest_id;
    let character_ids = this.request.body.character_ids;
    let player_id     = this.request.body.player_id;

    Player.findById(player_id).then( (player) => {
      Quest.findById(quest_id).then( (quest) => {
        whelp.model.find_many_by_id(Character, character_ids).then( (characters) => {
          Expedition.create({
            quest_id,
            character_ids,
            xp: quest.xp
          }).then( (expedition) => {
            player.expedition_ids.push(expedition.id)
            player.save().then( () => {
              expedition.start().then( () => {
                quest.deactivate().then( () => {
                  Load.player(player).then( (data) => {
                    Emit.event(WS_EMIT_EVENT_PLAYER_STATE_UPDATE, data, { data: { player }});
                    this.response.json(expedition);
                  }),
                  (error) => { this.response.json({ error }); }
                }),
                (error) => { this.response.json({ error }); }
              }),
              (error) => { this.response.json({ error }); }
            }),
            (error) => { this.response.json({ error }); }
          }),
          (error) => { this.response.json({ error }); }
        });
      });
    });
  }

}

module.exports = ExpeditionsController;
