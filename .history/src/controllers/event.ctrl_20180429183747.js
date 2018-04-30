import logger from '../logger'
import EventModel from '../models/event.model'
import Joi from 'joi'

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


export default {
  create: create,
  clear: clear
}