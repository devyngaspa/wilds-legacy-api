var Encounter = require('../../models/encounter/encounter');

class EncountersController {

  constructor (request, response) {
    this.request  = request;
    this.response = response;
    this.params   = request.params;
  }

  start () {
    let id = this.params.id;
    Encounter.findById(id).then( (encounter) => {
      encounter.start().then( () => {
        this.response.json({ encounter });
      });
    });
  }

  perform () {
    let id = this.params.id;
    let action = Object.assign({}, this.params);
    delete action.id;
    Encounter.findById(id).then( (encounter) => {
      encounter.perform(action).then( () => {
        this.response.json({ encounter });
      },
      (error) => {
        this.response.json({ error });
      });
    });
  }

  show () {
    let id = this.params.id;
    Encounter.findById(id).then( (encounter) => {
      this.response.json({ encounter });
    },
    (error) => {
      this.response.json({ error });
    });
  }

  load () {
    let id = this.params.id;
    Load.encounter(id).then( (data) => {
      this.response.json(data);
    },
    (error) => {
      this.response.json({ error });
    });
  }

}

module.exports = EncountersController;
