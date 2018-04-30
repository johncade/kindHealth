'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _event = require('../models/event.model');

var _event2 = _interopRequireDefault(_event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var joiEventSchema = _joi2.default.object({
  date: _joi2.default.date().iso().required(),
  user: _joi2.default.string().required(),
  type: _joi2.default.string().valid('leave', 'enter', 'highfive', 'comment').required(),
  message: _joi2.default.string().when('type', {
    is: 'comment',
    then: _joi2.default.string().required()
  }),
  otheruser: _joi2.default.string().when('type', {
    is: 'highfive',
    then: _joi2.default.string().required()
  })
});

var joiListQuerySchema = _joi2.default.object({
  from: _joi2.default.date().iso().required(),
  to: _joi2.default.date().iso().required()
});

var joiSummaryQuerySchema = _joi2.default.object({
  from: _joi2.default.date().iso().required(),
  to: _joi2.default.date().iso().required(),
  by: _joi2.default.string().valid('minute', 'hour', 'day').required()
});

function create(obj) {
  return new Promise(function (resolve, reject) {
    try {
      var _Joi$validate = _joi2.default.validate(obj, joiEventSchema),
          error = _Joi$validate.error,
          value = _Joi$validate.value;

      if (error) {
        _logger2.default.error(error);
        reject(new Error(error));
      }
      var event = (0, _event2.default)(obj);
      event.save(function (err, result) {
        if (err) {
          _logger2.default.error(err);
          reject(err);
        }
        _logger2.default.info(result);
        resolve();
      });
    } catch (err) {
      _logger2.default.error(err);
      reject(err);
    }
  });
};

function clear() {
  return new Promise(function (resolve, reject) {
    try {
      _event2.default.remove({}, function (err, result) {
        if (err) {
          _logger2.default.error(err);
          reject(err);
        }
        resolve(result);
      });
    } catch (err) {
      _logger2.default.error(err);
      reject(err);
    }
  });
};

function summary(from, to, timeframe) {
  return new Promise(function (resolve, reject) {
    try {
      to = new Date(to);
      from = new Date(from);
      _event2.default.find({
        date: {
          $gte: from,
          $lt: to
        }
      }, function (err, result) {
        if (err) {
          _logger2.default.error(err);
          reject(err);
        }
        var summary = {
          events: []
        };
        result.forEach(function (event) {
          var d = (0, _moment2.default)(event.date).startOf(timeframe).toISOString();
          var match = summary.events.find(function (e) {
            return e.date === d;
          });
          var type = event.type + 's';
          if (match) {
            if (match[type]) {
              match[type]++;
            } else {
              match[type] = 1;
            }
          } else {
            var newEvent = {
              date: d
            };
            newEvent[type] = 1;
            summary.events.push(newEvent);
          }
        });
        console.log(summary.events.length);
        summary.events = summary.events.sort(function (a, b) {
          return new Date(b) - new Date(a);
        }).map(function (event) {
          if (!event.enters) {
            event.enters = 0;
          }
          if (!event.leaves) {
            event.leaves = 0;
          }
          if (!event.comments) {
            event.comments = 0;
          }
          if (!event.highfives) {
            event.highfives = 0;
          }
          return event;
        });
        resolve(summary);
      });
    } catch (err) {
      _logger2.default.error(err);
      reject(err);
    }
  });
};

function list(from, to) {
  return new Promise(function (resolve, reject) {
    try {
      _event2.default.find({
        date: {
          $gte: new Date(from),
          $lt: new Date(to)
        }
      }, '-_id date user type message otheruser', function (err, result) {
        if (err) {
          _logger2.default.error(err);
          reject(err);
        }

        var list = {
          events: result
        };
        resolve(list);
      });
    } catch (err) {
      _logger2.default.error(err);
      reject(err);
    }
  });
};
exports.default = {
  create: create,
  clear: clear,
  list: list,
  summary: summary
};