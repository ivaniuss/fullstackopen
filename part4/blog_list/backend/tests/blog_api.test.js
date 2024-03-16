const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    for(let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs return id property instead of _id', async () =>{
    const blogs = await api.get('/api/blogs')
    const blog = blogs.body[0]
    assert.ok(blog.hasOwnProperty('id'))
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'test author',
      url: 'test url',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('test blog'))
  })

  test('blog without likes property defaults to 0', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'test author',
      url: 'test url'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blog = blogsAtEnd[blogsAtEnd.length - 1]
    assert.strictEqual(blog.likes, 0)
  })

  test('blog without title and url returns 400', async () => {
    const newBlog1 = {
      title: "test blog without url",
      author: 'test author',
      likes: 0
    }
    const newBlog2 = {
      likes: 0,
      url: "test url"
    }

    await api
      .post('/api/blogs')
      .send(newBlog1)
      .expect(400)

    await api
      .post('/api/blogs')
      .send(newBlog2)
      .expect(400)
  })

})

after(async () => {
  await mongoose.connection.close()
})