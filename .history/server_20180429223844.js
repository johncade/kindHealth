import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import morgan from 'morgan'

import logger from './src/logger'

import testRouter from './src/routes/test.router'
import eventRouter from './src/routes/event.router'

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express();
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/mongoApis'
const port = process.env.PORT || 3000

// MongoDB
mongoose.connect(mongoUrl, {
  useMongoClient: true,
  /* other options */
});

mongoose.connection.on('error', (err) => {
  logger.error(err);
  logger.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});
mongoose.set('debug', true);

// setting body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
  },
  stream: process.stderr
}));

app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode >= 400
  },
  stream: process.stdout
}));

app.use('/test', testRouter)

app.use('/events', eventRouter)

app.listen(port, () => {
  logger.info(`Server is up and listening at http://localhost:${port}`);
})