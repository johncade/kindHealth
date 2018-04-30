import EventModel from '../models/event.validator'
import logger from '../logger'

console.log(EventModel)
export var create = {
  validate: EventModel.validate.create,
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