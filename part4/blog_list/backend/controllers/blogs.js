const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response) => {
  const body = request.body

  Blog.findOne({title: body.title}).then(existingBlog => {
    if (existingBlog) {
      return response.status(400).json({error: 'title must be unique'})
    }
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    })
    blog.save().then(result => {
      response.status(201).json(result)
    })
  }).catch(error => {
    console.log('Error verifying if the blog exists:', error)
    response.status(500).json({error: 'Internal server error'})
  })

})

module.exports = blogsRouter