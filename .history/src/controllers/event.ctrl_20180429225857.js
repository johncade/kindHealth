import Joi from 'joi';
import moment from 'moment';
import logger from '../logger';
import EventModel from '../models/event.model';

const joiEventSchema = Joi.object({
  date: Joi.date().iso().required(),
  user: Joi.string().required(),
  type: Joi.string().valid('leave', 'enter', 'highfive', 'comment').required(),
  message: Joi.string().when('type', {
    is: 'comment',
    then: Joi.string().required()
  }),
  otheruser: Joi.string().when('type', {
    is: 'highfive',
    then: Joi.string().required()
  }),
});

const joiListQuerySchema = Joi.object({
  from: Joi.date().iso().required(),
  to: Joi.date().iso().required()
});

const joiSummaryQuerySchema = Joi.object({
  from: Joi.date().iso().required(),
  to: Joi.date().iso().required(),
  by: Joi.string().valid('minute', 'hour', 'day').required()
});

function create(obj) {
  return new Promise((resolve, reject) => {
    try {
      const {
        error,
        value
      } = Joi.validate(obj, joiEventSchema);
      if (error) {
        logger.error(error);
        reject(new Error(error));
      }
      let event = EventModel(obj);
      event.save((err, result) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        logger.info(result);
        resolve();
      });
    } catch (err) {
      logger.error(err);
      reject(err);
    }

  });
};

function clear() {
  return new Promise((resolve, reject) => {
    try {
      EventModel.remove({}, (err, result) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(result);
      });
    } catch (err) {
      logger.error(err);
      reject(err);
    }

  });
};

function summary(from, to, timeframe) {
  return new Promise((resolve, reject) => {
    try {
      to = new Date(to);
      from = new Date(from);
      EventModel.find({
        date: {
          $gte: from,
          $lt: to
        }
      }, (err, result) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        let summary = {
          events: []
        };
        result.forEach(event => {
          let d = moment(event.date).startOf(timeframe).toISOString();
          let match = summary.events.find(e => e.date === d);
          let type = event.type + 's'
          if (match) {
            if (match[type]) {
              match[type]++;
            } else {
              match[type] = 1;
            }
          } else {
            let newEvent = {
              date: d
            };
            newEvent[type] = 1;
            summary.events.push(newEvent);
          }
        });
        summary.events = summary.events.sort((a, b) => {
          return new Date(b) - new Date(a);
        }).map(event => {
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
          return event
        })
        resolve(summary);
      });
    } catch (err) {
      logger.error(err);
      reject(err);
    }

  });
};

function list(from, to) {
  return new Promise((resolve, reject) => {
    try {
      EventModel.find({
        date: {
          $gte: new Date(from),
          $lt: new Date(to)
        }
      }, '-_id date user type message otheruser', (err, result) => {
        if (err) {
          logger.error(err);
          reject(err);
        }

        let list = {
          events: result
        };
        resolve(list);
      });
    } catch (err) {
      logger.error(err)
      reject(err)
    }

  });
};
export default {
  create: create,
  clear: clear,
  list: list,
  summary: summary
};