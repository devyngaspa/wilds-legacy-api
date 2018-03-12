class WEventReceiver {

  static receiver (event) {
    let next_event = event.split('.').slice(1, event.split('.').length).join('.');
    if (next_event.includes('.')) {
      let path     = './' + event.split('.').slice(0, 2).join('/')
      let receiver = require(path);
      return receiver.receiver(next_event);
    } 

    else { 
      event        = event.split('.').pop();
      let receiver = new this()
      let fxn      = receiver[event];
      if (!fxn) { wlog(`No event handler defined for event '${event}', skipping`); return null; }
      return receiver; 
    }

  }

};

module.exports = WEventReceiver;
