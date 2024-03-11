const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('../utils/test_data')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('test_data likes average', () => {
    const result = listHelper.totalLikes(blogs)
    assert.strictEqual(result, 6)
  })
})

describe('favorite blog', () => {
  test('test_data favorite blog', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result.title, 'Canonical string reduction')
  })
})

describe('most blogs', () => {
  const blogs = [
    {
    author: "Robert C. Martin",
    blogs: 3
    },
    {
    author: "Edsger W. Dijkstra",
    blogs: 17
    }
  ]
  test('largest amount of blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result.blogs, 17)
  })
  test('test_data most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.strictEqual(result.author, 'Edsger W. Dijkstra')
  })
})