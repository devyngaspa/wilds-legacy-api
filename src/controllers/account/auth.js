const BaseController = require('../base')

class AuthController extends BaseController {

  google () {
  }

  redirect () {
    let id = whelp.object.find(this.request, 'session', 'passport', 'user');
    // this.response.cookie('user_id', id, { domain: 'http://localhost:3000' })
    this.response.redirect(301, "http://localhost:3000/login/success")
  }

}

module.exports = AuthController;
