import { User } from '../db/models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, passwordHash: hashedPassword })
  return await user.save()
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ username })
  if (!user) {
    // Use a generic error message to prevent username enumeration
    throw new Error('Wrong username or password')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect) {
    throw new Error('Wrong username or password')
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })

  return token
}

export async function getUserInfoById(userId) {
  try {
    const user = await User.findById(userId)
    if (!user) return { username: userId }
    return { username: user.username }
  } catch (e) {
    return { username: userId }
  }
}
