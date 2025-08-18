import mongoose, { Schema } from 'mongoose'

/** DATA LAYER */
const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    contents: String,
    tags: [String],
  },
  { timestamps: true },
)

export const Post = mongoose.model('post', postSchema)
