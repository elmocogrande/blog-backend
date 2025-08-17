import { Post } from '../db/models/post.js'

/** SERVICE LAYER */

// CREATE
/*  We specifically listed all properties that we want the user to be able to provide
    here instead of simply passing the whole object to the new Post() constructor.
    While we need to type more code this way, it allows us to have control over which
    properties a user should be able to set.
 */
export async function createPost({ title, author, contents, tags }) {
  const post = new Post({ title, author, contents, tags })
  return await post.save()
}

// READ
export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
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
  return Post.find(query).sort({ [sortBy]: sortOrder })
}

// UPDATE
export async function updatePostById(id, { title, author, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: id },
    { $set: { title, author, contents, tags } },
    { new: true },
  )
}

// DELETE
export async function deletePostById(id) {
  return await Post.deleteOne({ _id: id })
}
