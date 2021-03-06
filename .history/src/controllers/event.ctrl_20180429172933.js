import {
  validate
} from '../models/event.validator'
import logger from '../logger'

console.log(validate)
export var create = {
  validate: validate.create,
  handler: async (req, res) => {
    const {
      date,
      type,
      user,
      comment,
      otheruser
    } = req.body
    try {
      const event = await EventModel.model.create({
        date,
        type,
        user,
        comment,
        otheruser
      })
      const result = Object.assign({}, event.toObject())
      res.status(200).json({
        "status": "ok"
      })
    } catch (err) {
      logger.error(err)
      res.status(500).json({
        "status": "error"
      })
    }
  }
}