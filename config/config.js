require('dotenv').config(); //instatiate environment variables


let CONFIG = {}; //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'development';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mongo';
CONFIG.db_protocol  = process.env.db_PROTOCOL   || 'mongodb';
CONFIG.db_host      = process.env.DB_HOST       || '960d685db6ac';
CONFIG.db_port      = process.env.DB_PORT       || '27017';
CONFIG.db_name      = process.env.DB_NAME       || 'conFusion';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || 'db-password';

CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'your_jwt_secret';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '60';

module.exports = CONFIG;
