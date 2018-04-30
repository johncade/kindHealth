import express from 'express';
import Event from '../models/event.model';
import logger from '../logger';
import EventController from '../controllers/event.ctrl';


const eventRouter = express.Router();

eventRouter.route('/')
  .post(async (req, res) => {
    try {
      await EventController.create(req.body)
      res.status(200).json({
        status: "ok"
      })
    } catch (err) {
      res.status(500).json({
        status: "error"
      });
    }
  })
  .get(async (req, res) => {
    try {
      let result = await EventController.list(req.query.from, req.query.to)
      res.status(200).json(result)
    } catch (err) {
      logger.error('\n\n\nERROR\n\n\n')
      res.status(500).json({
        status: "error"
      });
    }
  });

eventRouter.route('/summary')
  .post(async (req, res) => {
    try {
      let result = await EventController.list(req.query.from, req.query.to, req.query.by)
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({
        status: "error"
      });
    }
  });

eventRouter.route('/clear')
  .post(async (req, res) => {
    try {
      await EventController.clear();
      res.status(200).json({
        status: "ok"
      });
    } catch (err) {
      res.status(500).json({
        status: "error"
      });
    }
  });
export default eventRouter;