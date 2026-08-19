const mongoose = require('mongoose')
// eslint-disable-next-line no-unused-vars
const { test, after, beforeEach } = require('node:test')
// eslint-disable-next-line no-unused-vars
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

// eslint-disable-next-line no-unused-vars
let token

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)

  const user = new User({
    username: 'testuser',
    passwordHash
  })

  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'secret'
    })

  token = loginResponse.body.token
})

after(async () => {
  await mongoose.connection.close()
})