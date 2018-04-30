import express from 'express';
import celebrate from 'celebrate'
import Event from '../models/event.model'
import logger from '../logger'
import EventController from '../controllers/event.ctrl'

const eventRouter = express.Router()

eventRouter.route('/')
  .post((req, res) => {
    celebrate(EventController.create.validate),
      EventController.create.handler
  })
  .get((req, res) => {
    Event.find({}, (err, events) => {
      res.json(events)
    })
  })

export default eventRouter