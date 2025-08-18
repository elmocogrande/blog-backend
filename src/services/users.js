import { User } from '../db/models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashedPassword })
  return await user.save()
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('User not found')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new Error('Wrong username or password')
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })

  return token
}
