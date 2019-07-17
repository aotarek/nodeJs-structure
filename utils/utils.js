const {to} = require('await-to-js');
const pe = require('parse-error');

module.exports.to = async (promise) => {
    const [err, res] = await to(promise);

    if (err) return [pe(err)];

    return [null, res];
};


// Error Web Response
module.exports.ReE = function (res, err, code) {
    let result = {success: false};

    if (typeof err === 'object' && typeof err.message !== 'undefined' && err.type) {
        err = {
            message: err.message,
            type: err.type
        };
    }

    if (typeof code !== 'undefined') {
        res.statusCode = code;
    }

    result = Object.assign(result, {error: err});
    return res.json(result);
};


// Success Web Response
module.exports.ReS = function (res, _data, statusCode, message, code) {
    let result = {success: true};
    let data = {data: _data, message: message, code: code};

    if (typeof _data === 'object') {
        result = Object.assign(result, data); //merge the objects
    }

    if (typeof statusCode !== 'undefined') {
        res.statusCode = statusCode;
    }

    return res.json(result);
};


// TE stands for Throw Error
module.exports.TE = TE = function (err_message, log) {
    if (log === true) {
        console.error(err_message);
    }

    throw new Error(err_message);
};

