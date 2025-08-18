import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Ensure the password hash is not revealed in API responses
    delete returnedObject.passwordHash
  },
})

export const User = mongoose.model('user', userSchema)
