function get_event_emitter (event, options) {
  let ns      = event.split('.').shift()
  let emitter = require('../websocket/emitters/' + ns);
  return emitter.emitter(event, options);
}

function get_method_for_event (event) { return event.split('.').pop(); }


class Emit {

  static event (event, data={}, options={}) {

    let emitter  = get_event_emitter(event, options);
    let method   = get_method_for_event(event);

    return emitter[method](data, options)
  }
}

module.exports = Emit;
