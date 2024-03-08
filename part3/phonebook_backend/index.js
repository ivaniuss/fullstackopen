const express = require('express');
var morgan = require('morgan')
const app = express();
const cors = require('cors');
const PORT = 3000;
const  Person = require('./models/person');

app.use(express.static('dist'))
app.use(cors())
app.use(express.json());

morgan.token('post-body', function(req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '';
});

app.use((req, res, next) => {
  if (req.method === 'POST') {
    return morgan(':method :url :response-time :post-body ')(req, res, next);
  } else if (req.method === 'GET') {
    return morgan(':method :url :response-time')(req, res, next);
  }
  next();
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)})
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then( person => {
    if (person) {
      response.json(person)
    }else{
      response.status(404).end() 
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  Person.findOne({name: body.name}).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })  
  }).catch(error => {
    console.error('Error veryfing if person exists:', error)
    response.status(500).json({ error: 'Internal Server Error' })
  })
  
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
