const BaseController = require('../base')

const access_denied = (response) => { response.sendStatus(423) }

class UsersController extends BaseController {

  login () {
    this.response.render('login');
  }

  profile () {
    this.response.render('profile', { user: this.request.user });
  }

  restore () {

    let id = whelp.object.find(this, 'request', 'session', 'passport', 'user')
    if (id) {
      this.response.json({ user: { _id: id }})
    }
    else {
      whelp.middleware.access_denied(this.response)
    }

    // let session_id = this.request.body.session_id;

    // if (user_id && session_id) {
    //   if (session_id === this.request.session.id) {
    //     User.findById(user_id).then( (user) => {
    //       this.response.json({ user })
    //     })
    //   }
    //   else {
    //     access_denied(this.response);
    //   }
    // }

    // else {
    //   access_denied(this.response);
    // }

    // console.log("req session", this.request)

    // console.log("restore:", user_id, session_id)

  }
  
}

module.exports = UsersController;
