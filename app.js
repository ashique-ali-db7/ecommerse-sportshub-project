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



const MongoStore = require('connect-mongo')

var app = express();
var fileUpload = require('express-fileupload')
var db = require('./config/connection');
const serviceId = process.env.serviceId;
const accountId = process.env.accountId;
const authToken = process.env.authToken;
const client = require("twilio")(accountId,authToken)


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
    cookie: { maxAge: 1000000000 },
   resave:false,
   saveUninitialized:true,
    store:MongoStore.create({
      mongoUrl:process.env.url,
      ttl: 2*24*60*60,
      autoRemove:'native'
    })
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
