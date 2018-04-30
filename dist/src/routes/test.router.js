'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var testRouter = _express2.default.Router();

testRouter.route('/').get(function (req, res) {
  res.send({
    "test": "Hello World!"
  });
});

exports.default = testRouter;