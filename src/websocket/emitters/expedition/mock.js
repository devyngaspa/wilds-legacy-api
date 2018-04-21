const WS_EMIT_EVENT_EXPEDITION_MOCK_UPDATE = require('../../events/emit/expedition/mock/update')

class ExpeditionMockEventEmitter extends WEventEmitter {

  update(data) {
    io.to(this.options.data.room).emit(WS_EMIT_EVENT_EXPEDITION_MOCK_UPDATE, data);
  }

};

module.exports = ExpeditionMockEventEmitter;
