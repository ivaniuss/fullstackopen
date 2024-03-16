const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  return response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const existingBlog = await Blog.findOne({title: body.title})
 
  if (existingBlog) {
    return response.status(400).json({error: 'title must be unique'})
  }
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })
  
  const result = await blog.save()
  response.status(201).json(result)

})

module.exports = blogsRouter