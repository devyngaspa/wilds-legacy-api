const BASE_DIR = SRCPATH + '/websocket/'

function get_event_receiver(event) {
  let ns       = event.split('.').shift()
  let receiver = require('../websocket/receivers/' + ns);
  return receiver.receiver(event);
}

function get_events_for_dir(dir) {
  if (whelp.is_js_file(dir)) { 
    return [BASE_DIR + dir.slice(0, -3)]; }
  else {
    let contents = fs.readdirSync(BASE_DIR + dir);
    let events   = [];
    contents.forEach((content) => {
      events = events.concat(get_events_for_dir(dir + '/' + content, events));
    });
    return events;
  }

}

function get_method_for_event(event) { return event.split('.').pop(); }

function get_events() { 
  let paths  = get_events_for_dir('events').map( (path) => { return '../.' + path; });
  let events = paths.map( (path) => { 
    let event    = require(path);
    let receiver = get_event_receiver(event)
    if (!receiver) { return null; }
    return { name: event, receiver: receiver }; 
  });
  return whelp.compact(events);
}

module.exports = {

  initialize: () => {
    io                        = socketio(HTTPSERV);
    const WS_EVENT_CONNECTION = 'connection'

    io.on(WS_EVENT_CONNECTION, (socket) => {
      console.log("made connection server");

      get_events().forEach( (event) => { 
        socket.on(event.name, (data) => {
          let receiver = event.receiver;
          let options  = { receiver, data, socket, io };
          let method   = get_method_for_event(event.name);
          receiver[method](options);
        });
      });
      
    });
  }

}
