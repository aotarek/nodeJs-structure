const jwt = require('jsonwebtoken');
const passport = require('passport');
const blacklist = require('express-jwt-blacklist');
const multer = require('../config/multer.config');
const User = require('../models/user.model');
const {to, ReE, ReS} = require('../utils/utils');
const CutomError = require('../utils/customError');

const signIn = async function (req, res, next) {

    //validate incoming params
    if (!req.body.email || !req.body.password) {
        let err = new CutomError('All fields required', 'unknown');
        return ReE(res, err, 422);
    }

    passport.authenticate('local', {session: false}, (err, user, info) => {
        // If Passport throws/catches an error
        if (err) {
            return ReE(res, err, 404);
        }

        if (!user) {
            // If user is not found || invalid credentials
            let err = new CutomError(info.message, 'unknown');
            return ReE(res, err, 401);
        }
        else {
            // If a user is found && valid credentials
            /*req.login(user, {session: false}, (err) => {
                if (err) {
                    res.send(err);
                }
                // generate a signed son web token with the contents of user object and return it in the response
                const token = jwt.sign(user.toJSON(), 'your_jwt_secret', {
                    expiresIn: 604800 // 1 week
                });
                return res.json({user, token});
            });*/
            user.token = user.generateJWT();
            return ReS(res, {user: user.toAuthJSON()}, 200, 'Successfully authenticated.', 'auth.signIn');
        }
    })(req, res);
};
module.exports.signIn = signIn;


const signUp = async function (req, res, next) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const password = req.body.password;
    const confirmed_password = req.body.confirmed_password;

    //validate incoming params
    if (!email || !lastName || !firstName || !phone || !password || !confirmed_password) {
        let err = new CutomError('All fields required', 'unknown');
        return ReE(res, err, 422);
    }

    //Check the database for an existing user by Email
    try {
        const user = await User.findOne({email});
        if (user) {
            let err = new CutomError('An account already exists with this email.', 'unknown');
            return ReE(res, err, 409);
        }
    } catch (error) {
        let err = new CutomError(error.message, 'unknown');
        return ReE(res, err, 404);
    }

    //Compare the password fields
    if (password !== confirmed_password) {
        let err = new CutomError('Password and confirm password does not match', 'unknown');
        return ReE(res, err, 422);
    }

    let user = new User(req.body);
    user.setPassword(req.body.password);

    return user.save()
        .then(
            () => ReS(res, user.toAuthJSON(), 200, 'Successfully created new user.', 'auth.signUp')
        ).catch((err) => next(err));
};
module.exports.signUp = signUp;


const logOut = async function (req, res, next) {
    blacklist.revoke(req.payload);
    ReS(res, {logout: "true"}, 200, 'Successfully logged out.', 'auth.logOut');
};
module.exports.logOut = logOut;


const isAuthenticated = async function (req, res, next) {
    const {payload: {id}} = req;

    return User.findById(id)
        .then((user) => {
            if (!user) {
                let err = new CutomError('User not Found', 'unknown');
                return ReE(res, err, 404);
            }

            return ReS(res, user, 200, 'Successfully verified.', 'auth.isAuthenticated');
        });
};
module.exports.isAuthenticated = isAuthenticated;

