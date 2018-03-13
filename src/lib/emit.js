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
  }
}

module.exports = Emit;
