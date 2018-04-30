import logger from '../logger'
import EventModel from '../models/event.model'
import Joi from 'joi'
import moment from 'moment'

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
})

const joiSummaryQuerySchema = Joi.object({
  from: Joi.date().iso().required(),
  to: Joi.date().iso().required(),
  by: Joi.string().valid('minute', 'hour', 'day').required()
})

function create(obj) {
  return new Promise((resolve, reject) => {
    const {
      error,
      value
    } = Joi.validate(obj, joiEventSchema)
    if (error) {
      logger.error(error)
      reject(new Error(error))
    }
    let event = EventModel(obj)
    event.save((err, result) => {
      if (err) {
        logger.error(err)
        reject(err)
      }
      logger.info(result)
      resolve()
    })
  })
}

function clear() {
  return new Promise((resolve, reject) => {
    EventModel.remove({}, (err, result) => {
      if (err) {
        logger.error(err)
        reject(err)
      }
      resolve(result)
    })
  })
}

function summary(from, to, timeframe) {
  return new Promise((resolve, reject) => {
    EventModel.find({
      date: {
        $gte: ISODate(from),
        $lt: ISODate(to)
      }
    }, (err, result) => {
      if (err) {
        logger.error(err)
        reject(err)
      }

    })
  })
}
export default {
  create: create,
  clear: clear
}