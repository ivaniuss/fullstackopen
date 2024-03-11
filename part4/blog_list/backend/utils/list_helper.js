const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0) / blogs.length

}

const favoriteBlog = blogs => {
  return blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
}

const mostBlogs = blogs => {
  return blogs.reduce((max, blog) => max.blogs > blog.blogs ? max : blog)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}