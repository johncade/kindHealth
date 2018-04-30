"use strict";

var winston = require("winston");

var level = process.env.LOG_LEVEL || 'debug';

var logger = new winston.Logger({
  transports: [new winston.transports.Console({
    level: level,
    timestamp: function timestamp() {
      return new Date().toISOString();
    }
  })]
});

module.exports = logger;