class WEventEmitter {

  constructor (options={}) {
    this.options = options;
    if (!options.data.room) {
      this.options.data.room = options.data.room || this.get_room(options);
    }
  }

  get_room (options) {
    let player = options.data.player;
    if (!player) { return null; }
    let room   = 'player_' + player._id;
    return room;
  }

  static emitter (event, options) {
    let next_event = event.split('.').slice(1, event.split('.').length).join('.');
    if (next_event.includes('.')) {
      let path    = './' + event.split('.').slice(0, 2).join('/')
      let emitter = require(path);
      return emitter.emitter(next_event, options);
    } 

    else { 
      event       = event.split('.').pop();
      let emitter = new this(options)
      let fxn     = emitter[event];
      if (!fxn) { throw `No event handler defined for event '${event}'` }
      return emitter; 
    }

  }

};

module.exports = WEventEmitter;
