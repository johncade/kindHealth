import logger from '../logger'
import EventModel from '../models/event.model'
import Joi from 'joi'

const joiEventSchema = Joi.object({
  date: Joi.date().iso().required(),
  user: Joi.string().required(),
  type: Joi.string().valid('leave', 'enter', 'highfive', 'comment').required(),
  comment: Joi.string(),
  otheruser: Joi.string()
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



  return value
}


export default {
  create: create
}