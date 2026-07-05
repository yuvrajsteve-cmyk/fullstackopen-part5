const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const config = require('../utils/config')

describe('when there is initially one user in db', () => {
  
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(config.MONGODB_URI)
    }
  }, 10000)

  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', passwordHash: 'secret' })
    await user.save()
  })

  test('creation fails with 400 and right message if username is too short', async () => {
    const newUser = {
      username: 'ab', 
      name: 'Test User',
      password: 'goodpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400) 
      .expect('Content-Type', 'application/json; charset=utf-8') 

    expect(result.body.error).toBe('username must be at least 3 characters long')
  })

  test('creation fails with 400 and right message if password is too short', async () => {
    const newUser = {
      username: 'validusername',
      name: 'Test User',
      password: '12' 
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', 'application/json; charset=utf-8') 

    expect(result.body.error).toBe('password must be at least 3 characters long')
  })

  test('creation fails with 400 if username is not unique', async () => {
    const newUser = {
      username: 'root', 
      name: 'Another Root',
      password: 'supersecurepassword' 
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toBe('expected `username` to be unique')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
