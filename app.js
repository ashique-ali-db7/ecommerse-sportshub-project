var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var helpers = require('handlebars-helpers')();
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var session = require('express-session');

var app = express();
var fileUpload = require('express-fileupload')
var db = require('./config/connection');
const serviceId = process.env.serviceId;
const accountId = process.env.accountId;
const authToken = process.env.authToken;
const client = require("twilio")(accountId,authToken)

var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AWPBmW_X6WuWTPTePp1dNkK76OzvUn69WD51gJRyVJ7Tj1K7XuD435AM7WVle7kmBpNq4D-svJgAZN9e',
  'client_secret': 'EHyPlmXTbb4EtoqZa8EtlNTVKO9Wzaz8GTqh8OnSWIy1LVP6CV2fWMCmNDe9OO5WS3YlcZuLlht7ZBWK'
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))
 app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10000000 },
   resave:false,
   saveUninitialized:true,
    
  })
);
db.connect((err)=>{
  if(err){
    console.log("database is not connected");
  }
  else{
    console.log("database is connected");
  }
});
app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
