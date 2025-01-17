var createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const expressLayouts = require('express-ejs-layouts');

//import ipfs-http-client
const { create } = require('ipfs-http-client');

const indexRouter = require('./routes/index');
const connectionRouter = require('./routes/connection');
const proofRouter = require('./routes/proof');
const revocationRouter = require('./routes/revocation');
const uploadRouter = require('./routes/upload');
const app = express();

//var indy = require('indy-sdk');

// view engine setup
app.use(expressLayouts);
app.set('layout', __dirname + '/views/layouts/main');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(fileUpload());


app.use('/', indexRouter);
app.use('/connections', connectionRouter);
app.use('/proofs', proofRouter);
app.use('/revocation', revocationRouter);
app.use('/upload', uploadRouter);

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
