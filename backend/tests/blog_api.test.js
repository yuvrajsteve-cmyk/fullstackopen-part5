const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') 
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const assert = require('assert')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  { 
    title: 'React patterns', 
    author: 'Michael Chan', 
    url: 'https://reactpatterns.com/', 
    likes: 7 
  },
  { 
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/', 
    likes: 5 
  }
]

let token

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secretpassword', 10)
  const user = new User({ username: 'testuser', passwordHash })
  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }
  token = jwt.sign(userForToken, process.env.SECRET)

  let blogObject = new Blog({ ...initialBlogs[0], user: savedUser._id })
  await blogObject.save()

  blogObject = new Blog({ ...initialBlogs[1], user: savedUser._id })
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('blog posts have a unique identifier named id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]
  expect(firstBlog.id).toBeDefined()
})

test('a valid blog can be added', async () => {
  const startResponse = await api.get('/api/blogs')
  const totalBlogsAtStart = startResponse.body.length

  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://utexas.edu',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const endResponse = await api.get('/api/blogs')
  expect(endResponse.body.length).toBe(totalBlogsAtStart + 1)

  const titles = endResponse.body.map(b => b.title)
  expect(titles).toContain('Canonical string reduction')
})

test('if the likes property is missing, it wil default to 0', async () => {
  const newBlogWithoutLikes = {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://cleancoder.com'
  }

  const response = await api 
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0)
})

test('blog without title is not added and responds with 400 Bad Request', async () => {
  const newBlogWithoutTitle = {
    author: 'Robert C. Martin',
    url: 'http://cleancoder.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400)
})

test('blog without url is not added and responds with 400 Bad Request', async () => {
  const newBlogWithoutUrl = {
    title: 'Types wars',
    author: 'Robert C. Martin',
    likes: 2
  }

  await api 
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400)
})

test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
  const newBlog = {
    title: 'Unsecured Blog',
    author: 'Hacker',
    url: 'http://hacker.com',
    likes: 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('updating a blog', () => {
  test('succeed with status code 200 if data is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogsToUpdate = blogsAtStart[0]
    const updatedLikes = { likes: blogsToUpdate.likes + 1 }

    await api
      .put(`/api/blogs/${blogsToUpdate.id}`)
      .send(updatedLikes)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()  
    const updatedBlog = blogsAtEnd.find(b => b.id === blogsToUpdate.id)
    assert.strictEqual(updatedBlog.likes, blogsToUpdate.likes + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close() 
})
