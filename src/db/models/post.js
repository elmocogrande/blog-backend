import mongoose, { Schema } from 'mongoose'

/** DATA LAYER */
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: String,
    contents: String,
    tags: [String],
  },
  { timestamps: true },
)

export const Post = mongoose.model('post', postSchema)
