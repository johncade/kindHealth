import express from 'express';
import celebrate from 'celebrate'
import Event from '../models/event.model'
import logger from '../logger'
import {
  create
} from '../controllers/event.ctrl'

const eventRouter = express.Router()

eventRouter.route('/')
  .post((req, res) => {
    celebrate(create.validate),
      create.handler
  })
  .get((req, res) => {
    Event.find({}, (err, events) => {
      res.json(events)
    })
  })

export default eventRouter