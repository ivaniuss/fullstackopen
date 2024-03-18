const jwt = require('jsonwebtoken')
const logger = require('./logger')
const config = require('../utils/config')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');
  
  if (!authorization) {
    return response.status(401).json({ error: 'token missing' });
  }

  if (!authorization.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const token = authorization.substring(7);
  const decodedToken = jwt.verify(token, config.SECRET);
  console.log('decoded', decodedToken)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id);
  request.user = user; 
  next();
};

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  
  const bodyCopy = { ...request.body };
  
  Object.keys(bodyCopy).forEach(key => {
    if (/password/i.test(key)) {
      bodyCopy[key] = '******';
    }
  });

  logger.info('Body:  ', bodyCopy)
  
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor
}