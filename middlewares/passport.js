const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');

// set passport local strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return User.findOne({email})
            .then(user => {
                // Return if :  user not found in database || password is wrong
                if (!user || !user.validatePassword(password)) {
                    return cb(null, false, {message: 'Invalid email or password.'});
                }

                // If credentials are correct, return the user object
                return cb(null, user, {message: 'Logged In Successfully'});
            })
            .catch(err => cb(err));

    }
));