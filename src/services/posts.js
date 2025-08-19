import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

/** SERVICE LAYER */

// CREATE
/*  We specifically listed all properties that we want the user to be able to provide
    here instead of simply passing the whole object to the new Post() constructor.
    While we need to type more code this way, it allows us to have control over which
    properties a user should be able to set.
 */
export async function createPost(userId, { title, author, contents, tags }) {
  const post = new Post({ title, author: userId, contents, tags })
  return await post.save()
}

// READ
export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  // Find the user by username to get their ID
  const user = await User.findOne({ username: authorUsername })
  if (!user) return [] // Return empty array if author not found

  return await listPosts({ author: user._id }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function getPostById(id) {
  return Post.findById(id)
}

// Helper function for listing posts
async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'desc' } = {},
) {
  return Post.find(query)
    .populate('author', 'username')
    .sort({ [sortBy]: sortOrder })
}

// UPDATE
export async function updatePostById(
  userId,
  postId,
  { title, author, contents, tags },
) {
  return Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, author, contents, tags } },
    { new: true },
  )
}

// DELETE
export async function deletePostById(userId, postId) {
  return Post.deleteOne({ _id: postId, author: userId })
}
