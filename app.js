var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
import ConnectToDB from './utils/connectToDb';

var usersRouter = require('./routes/users');
import fabricationRouter from './routes/fabrication';
import subAssemblyRouter from './routes/subAssembly';
import assemblyRouter from './routes/assembly';

import cors from 'cors';

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const db = new ConnectToDB();
db.connect();
app.use('/api/users', usersRouter);
app.use('/api/fabrication', fabricationRouter);
app.use('/api/subassembly', subAssemblyRouter);
app.use('/api/assembly', assemblyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
