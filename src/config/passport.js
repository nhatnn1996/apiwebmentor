const passport = require("passport"),
    User = require("../models/user"),
    config = require("./main"),
    JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt,
    LocalStrategy = require("passport-local").Strategy;
const localOptions = {
    usernameField: "email",
    passwordField: "password"
};

//Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(
    email,
    password,
    done
) {
    User.findOne({ email }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                error: "Username or password is not correct. "
            });
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false, {
                    error: "Username or password is not correct."
                });
            }
            return done(null, user);
        });
    });
});

// Tells passport to check authorization headers for JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: config.secret
};

// JWT login strategy setup
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.findById(payload._id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        }
    });
});
passport.use("local", localLogin);
passport.use("jwt", jwtLogin);
module.exports = passport;
