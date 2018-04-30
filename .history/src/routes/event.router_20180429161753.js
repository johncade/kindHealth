import express from 'express';
import Event from '../models/event.model'

const eventRouter = express.Router()

eventRouter.route('/')
  .post((req, res) => {
    let event = new Event(req.body)
    event.save()
    res.status(200).send(event)
  })
  .get((req, res) => {
    Event.find({}, (err, events) => {
      res.json(events)
    })
  })

export default eventRouter