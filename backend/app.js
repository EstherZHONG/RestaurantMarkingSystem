var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'some word',
  cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));


// app.get('/api/hello', (req, res) => {
//   res.send({ express: 'Hello From Express' });
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  next(createError(404));

});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (req.app.get('env') === 'development') {
    console.error(err);
  }
  
  res.status(err.status || 500).json({message: err.message}).end();
  // res.render('error');
});



module.exports = app;
