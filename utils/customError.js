'use strict';

module.exports = function CustomError(message, type) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message;
    this.type = type;
};

require('util').inherits(module.exports, Error);