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
  });
};

function clear() {
  return new Promise((resolve, reject) => {
    EventModel.remove({}, (err, result) => {
      if (err) {
        logger.error(err);
        reject(err);
      }
      resolve(result);
    });
  });
};

function summary(from, to, timeframe) {
  return new Promise((resolve, reject) => {
    to = new Date(to)
    from = new Date(from)
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
        if (match) {
          if (match[event.type]) {
            match[event.type]++;
          } else {
            match[event.type] = 1;
          }
        } else {
          let newEvent = {
            date: d
          };
          newEvent[event.type] = 1;
          summary.events.push(newEvent);
        }
      });
      summary.events = summary.events.sort((a, b) => {
        return new Date(b) - new Date(a);
      })
      resolve(summary);
    });
  });
};

function list(from, to) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`\n\n\n IN LIST ${from}, ${to}\n\n`)
      to = new Date(to).toISOString()
      from = new Date(from).toISOString()
      console.log(`\n\n\n IN LIST ${from}, ${to}\n\n`)
      EventModel.find({
        date: {
          $gte: new Date(from),
          $lt: new Date(to)
        }
      }, (err, result) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        let list = {
          events: result
        }
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