import mongoose from 'mongoose'
import { beforeAll, afterAll, afterEach, beforeEach } from '@jest/globals'
import { initDatabase } from '../db/init.js'
import { Post } from '../db/models/post.js'

beforeAll(async () => {
  await initDatabase()
})

// Clean up the db after each test
afterEach(async () => {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.disconnect()
})
