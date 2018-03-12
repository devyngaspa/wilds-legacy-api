function get_event_emitter (event) {
  let ns      = event.split('.').shift()
  let emitter = require('../websocket/emitters/' + ns);
  return emitter.emitter(event);
}

function get_method_for_event (event) { return event.split('.').pop(); }


class Emit {

  static event (event, data={}, options={}) {

    let emitter  = get_event_emitter(event);
    let method   = get_method_for_event(event);

    return emitter[method](data, options)
    // return new Promise( (resolve, reject) => {
    //   get_encounter(params, (typeof params == 'string')).then( (encounter) => {
    //     let hash = {
    //       actors:        encounter.get_actors(),
    //       current_actor: encounter.get_current_actor(),
    //       parties:       encounter.parties()
    //     }
    //     whelp.promise_hash(hash).then( (data) => {
    //       data.encounter = encounter;
    //       resolve(data);
    //     });
    //   });
    // });
  }
}

module.exports = Emit;
