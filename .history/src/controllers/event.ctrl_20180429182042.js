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
  const {
    error,
    value
  } = Joi.validate(obj, joiEventSchema)
  logger.info(error)
  if (error) {
    logger.info(error)
    return new Error(error)
  }
  let event = EventModel(obj)
  event.save()
  return value
}


export default {
  create: create
}