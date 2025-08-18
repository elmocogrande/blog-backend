import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { createUser } from '../services/users.js'
import { User } from '../db/models/user.js'
import { describe, expect, test, beforeAll, afterAll, beforeEach } from '@jest/globals'

let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

beforeEach(async () => {
  await User.deleteMany({})
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('User Service', () => {
  describe('createUser', () => {
    test('should create a new user with a hashed password', async () => {
      const userData = { username: 'testuser', password: 'password123' }
      const createdUser = await createUser(userData)

      expect(createdUser._id).toBeDefined()
      expect(createdUser.username).toBe(userData.username)

      // Verify the user is in the database and the password is not plain text
      const foundUser = await User.findById(createdUser._id)
      expect(foundUser.passwordHash).toBeDefined()
      expect(foundUser.passwordHash).not.toBe(userData.password)

      // Verify the stored hash matches the original password
      const isMatch = await bcrypt.compare(userData.password, foundUser.passwordHash)
      expect(isMatch).toBe(true)
    })

    test('should fail to create a user with a duplicate username', async () => {
      const userData = { username: 'duplicate', password: 'password123' }
      await createUser(userData) // Create the first user

      // Attempt to create another user with the same username
      await expect(createUser(userData)).rejects.toThrow()
    })

    test('should fail if username is not provided', async () => {
      await expect(createUser({ password: 'password123' })).rejects.toThrow(
        mongoose.Error.ValidationError
      )
    })
  })
})