const logger = require('./logger')
const morgan = require('morgan')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

morgan.token('post-body', function(req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});


const morganMiddleware = (req, res, next) => {
  if (req.method === 'POST') {
    return morgan(':method :url :response-time :post-body ')(req, res, next);
  } else if (req.method === 'GET') {
    return morgan(':method :url :response-time')(req, res, next);
  }
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  morganMiddleware
}