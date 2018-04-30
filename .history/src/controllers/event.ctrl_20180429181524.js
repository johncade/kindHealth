import logger from '../logger'
import EventModel from '../models/event.model'

const joiEventSchema = Joi.object({
  date: Joi.date().iso().required(),
  user: Joi.string().required(),
  type: Joi.string().valid('leave', 'enter', 'highfive', 'comment').required(),
  comment: Joi.string(),
  otheruser: Joi.string()
});



export create = function (obj) {
  const {
    error,
    value
  } = Joi.validate(obj, joiEventSchema)
  if (error) {
    logger.info(error)
    return new Error(error)
  }
  EventModel.save(value)
  return value
}