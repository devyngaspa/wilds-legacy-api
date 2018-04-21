const secrets = require('../config/secrets')

module.exports = {

  initialize: () => {

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
      User.findById(id).then( (user) => {
        done(null, user);
      });
    });

    passport.use(
      new GoogleStrategy({
        callbackURL:  '/auth/google/redirect',
        clientID:     secrets.google.clientID,
        clientSecret: secrets.google.clientSecret
      }, (accessToken, refreshToken, profile, done) => {
        let google_id = profile.id;
        whelp.model.find_or_create(User, { 'oauth.google_id': google_id }).then( (user) => {
          done(null, user);
        },
        (error) => {
          console.log("err", error);
        });
      })
    );
  }
}
