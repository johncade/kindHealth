'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var eventModel = new Schema({
  date: {
    type: Date
  },
  user: {
    type: String
  },
  type: {
    type: String
  },
  message: {
    type: String
  },
  otheruser: {
    type: String
  }
}, {
  versionKey: false
});
exports.default = _mongoose2.default.model('events', eventModel);