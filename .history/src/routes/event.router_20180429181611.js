import express from 'express';
import {
  celebrate
} from 'celebrate'
import Event from '../models/event.model'
import logger from '../logger'
import EventController from '../controllers/event.ctrl'


const eventRouter = express.Router()

eventRouter.route('/')
  .post((req, res) => {
    try {
      EventController.create(req.body)
      res.status(200).json({
        status: "ok"
      })
    } catch (err) {
      logger.error(err)
      res.status(500).json({
        status: "error"
      })
    }
  })
  .get((req, res) => {
    Event.find({}, (err, events) => {
      res.json(events)
    })
  })

export default eventRouter