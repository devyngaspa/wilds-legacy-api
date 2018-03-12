class WEventEmitter {

  static emitter (event) {
    let next_event = event.split('.').slice(1, event.split('.').length).join('.');
    if (next_event.includes('.')) {
      let path    = './' + event.split('.').slice(0, 2).join('/')
      let emitter = require(path);
      return emitter.emitter(next_event);
    } 

    else { 
      event       = event.split('.').pop();
      let emitter = new this()
      let fxn     = emitter[event];
      if (!fxn) { throw `No event handler defined for event '${event}'` }
      return emitter; 
    }

  }

};

module.exports = WEventEmitter;
