class BaseController {

  constructor (request, response, next) {
    this.request  = request;
    this.response = response;
    this.next     = next;
    this.params   = request.params;
  }

}

module.exports = BaseController;
