const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const PORT = process.env.PORT || 3000;

const app = express();
const inbound = require('../api/inbound');
const outbound = require('../api/outbound');
const auth = require('./../middeware');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/inbound/sms', auth.isAuthorized, inbound);
app.use('/api/outbound/sms', auth.isAuthorized, auth.updateCache, outbound);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

auth.initizeCache();
cron.schedule('* */12 * * *', () => {
  auth.initizeCache();
  //console.log('Running a task every 12 hours');
});

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
});
module.exports = app;