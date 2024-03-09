const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
  response.json(persons)})
})

personsRouter.get('/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then( person => {
    if (person) {
      response.json(person)
    }else{
      response.status(404).end() 
    }
  }).catch(error => next(error))
})

personsRouter.delete('/:id', (request, response) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    response.status(204).end()
  }).catch(error => next(error))
})

personsRouter.post('/', (request, response) => {
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

personsRouter.put('/:id', (request, response, next) => {
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

module.exports = personsRouter