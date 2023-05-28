const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "Email Belum Terdaftar!" });
    }

    try {
      const match = await bcrypt.compare(password, user.passwordChecked);
      if (match == true) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Salah!" });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
