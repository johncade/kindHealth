'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _logger = require('./src/logger');

var _logger2 = _interopRequireDefault(_logger);

var _test = require('./src/routes/test.router');

var _test2 = _interopRequireDefault(_test);

var _event = require('./src/routes/event.router');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
var app = (0, _express2.default)();
var mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/mongoApis';
var port = process.env.PORT || 3000;

// MongoDB
_mongoose2.default.connect(mongoUrl, {
  useMongoClient: true
  /* other options */
});

_mongoose2.default.connection.on('error', function (err) {
  _logger2.default.error(err);
  _logger2.default.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
_mongoose2.default.set('debug', true);

// setting body parser middleware 
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({
  extended: true
}));

app.use((0, _morgan2.default)('dev', {
  skip: function skip(req, res) {
    return res.statusCode < 400;
  },
  stream: process.stderr
}));

app.use((0, _morgan2.default)('dev', {
  skip: function skip(req, res) {
    return res.statusCode >= 400;
  },
  stream: process.stdout
}));

app.use('/test', _test2.default);

app.use('/events', _event2.default);

app.listen(port, function () {
  _logger2.default.info('Server is up and listening at http://localhost:' + port);
});