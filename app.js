const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const logger        = require('morgan');
const fs            = require('fs');
const swaggerDoc    = require('./config/swaggerDoc');
require('./middlewares/passport');
const v1            = require('./routes/v1');
const CONFIG        = require('./config/config');


// database
const mongoose  = require('mongoose');
const url       = `${CONFIG.db_protocol}://${CONFIG.db_host}:${CONFIG.db_port}/${CONFIG.db_name}`;
mongoose.connect(url).then((db) => {
    console.log("Connected correctly to server : ", url);
}, (err) => {
    console.log(err);
});

// express app
let app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// logger
app.use(logger('dev', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
}));
app.use(logger('dev'));


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(passport.initialize());
app.use('/api/v1', v1);

// load swagger spec
swaggerDoc(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.redirect('/not-found.html');
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
