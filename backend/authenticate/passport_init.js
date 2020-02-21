const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { student_basic_detail } = require('../db/index');

passport.serializeUser(function (user, done) {

  done(null, user.user_id)
});

passport.deserializeUser(function (userKey, done) {

    student_basic_detail.findByPrimary(userKey).then((user) => {
    done(null, user)
  }).catch((err) => {

    done(err)
  })
});



passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  function (username, password, done) {
    console.log(username+" jdjfskjdfkjfds")
    student_basic_detail.findOne({
      where: {

        email: username,
        password:password
      }
    }).then((user) => {
      console.log(user)
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      return done(null, user);
    }).catch((err) => {
        console.log("ankjdsasa don")
      done(err)
    })
  }
));

module.exports = passport