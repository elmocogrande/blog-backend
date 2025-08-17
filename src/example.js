import { initDatabase } from './db/init.js'
import { Post } from './db/models/post.js'
import globalSetup from './test/globalSetup.js'
import globalTeardown from './test/globalTeardown.js'

await globalSetup()
await initDatabase()

// Create a new sample blog post
const post = new Post({
  title: 'Hello Daniel',
  author: 'Daniel Bugl',
  contents: 'This post is stored in a MongoDB database using Mongoose.',
  tags: ['mongoose', 'mongodb'],
})

// Save our post to the database
const createdPost = await post.save()
await Post.findByIdAndUpdate(createdPost._id, {
  $set: { title: 'Hello again, Mongoose!' },
})

// Retrieve data
const posts = await Post.find()
console.log(posts)
