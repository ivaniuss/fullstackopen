const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'test1',
    author: 'test1',
    url: 'test1',
    likes: 1
  },
  {
    title: 'test2',
    author: 'test2',
    url: 'test2',
    likes: 2
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()
  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb,
}