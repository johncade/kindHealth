import Mongoose from 'mongoose';
import Joigoose from 'joigoose';
import Joi from 'joi';

Joigoose = Joigoose(Mongoose)


const Schema = Mongoose.Schema

var joiEventSchema = Joi.object({
  date: Joi.date().iso().required(),
  user: Joi.string().required(),
  type: Joi.string().valid('leave', 'enter', 'highfive', 'comment').required(),
  comment: Joi.string(),
  otheruser: joi.string()
});

const mongooseEventSchema = new Schema(Joigoose.convert(joiEventSchema));

export const validate = {
  post: {
    body: joiEventSchema.requiredKeys('date', 'user', 'type')
  },
  get: {
    params: {
      from: Joi.date().iso(),
      to: Joi.date().iso()
    }
  },
  summary: {
    params: {
      from: Joi.date().iso(),
      to: Joi.date().iso(),
      by: Joi.string().valid('minute', 'hour', 'day')
    }
  },
  np
}