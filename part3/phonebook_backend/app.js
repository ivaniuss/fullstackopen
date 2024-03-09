const express = require('express');
const cors = require('cors');
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const app = express();
const personsRouter = require('./controllers/persons')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  }).catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(cors())
app.use(express.json());
// app.use(middleware.requestLogger)
app.use(middleware.morganMiddleware)
app.use('/api/persons', personsRouter)

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app;