import express from 'express';

const eventRouter = express.Router()

eventRouter.route('/')
  .get((req, res) => {
    res.send({
      "test": "Hello World!"
    })
  })

export default eventRouter