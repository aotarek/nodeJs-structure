const jwt            = require('express-jwt');
const blacklist      = require('express-jwt-blacklist');
const CONFIG         = require('../config/config');
const {to, ReE, ReS} = require('../utils/utils');
const CutomError     = require('../utils/customError');


const getTokenFromHeaders = (req) => {
    const {headers: {authorization}} = req;
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
        const token = authorization.split(' ')[1];
        return token;
    }
    return null;
};

const auth = {
    required: jwt({
        secret: CONFIG.jwt_encryption,
        userProperty: 'payload',
        isRevoked: blacklist.isRevoked,
        //isRevoked: isRevokedCallback,
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: CONFIG.jwt_encryption,
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
    unauthorizedErrorHundler: (err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
            let errror = new CutomError(err.message, 'UnauthorizedError');
            return ReE(res, errror, 401);
        }
        next();
    }
};

module.exports = auth;
