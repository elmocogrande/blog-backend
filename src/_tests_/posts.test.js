import mongoose from 'mongoose'
import {
  createPost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  updatePostById,
  deletePostById,
} from '../services/posts.js'
import { describe, expect, test, beforeEach } from '@jest/globals'
import { Post } from '../db/models/post.js'

describe('creating posts', () => {
  test('creating posts with all parameters should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
      author: 'Daniel Bugl',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }
    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)
    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('creating posts without title should fail', async () => {
    const post = {
      author: 'Daniel Bugl',
      contents: 'Post with no title',
      tags: ['empty'],
    }

    // We expect two assertions to be called in the catch block.
    // If createPost() doesn't throw an error, the test will fail.
    expect.assertions(2)

    try {
      await createPost(post)
    } catch (err) {
      expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(err.message).toContain('`title` is required')
    }
  })

  test('creating posts with minimal params should succeed', async () => {
    const post = {
      title: 'Hello Mongoose!',
    }

    const createdPost = await createPost(post)
    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

describe('listing posts', () => {
  // Load the db with test data
  beforeEach(async () => {
    const post1 = {
      title: 'Post 1',
      author: 'Author 1',
      contents: 'Contents 1',
      tags: ['tag1', 'tag2'],
    }
    const post2 = {
      title: 'Post 2',
      author: 'Author 1',
      contents: 'Contents 2',
      tags: ['tag2', 'tag3'],
    }
    const post3 = {
      title: 'Post 3',
      author: 'Author 2',
      contents: 'Contents 3',
      tags: ['tag1', 'tag3'],
    }
    await Post.create(post1, post2, post3)
  })

  test('listing all posts should succeed', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toBe(3)
  })

  test('listing posts by author should succeed', async () => {
    const posts = await listPostsByAuthor('Author 1')
    expect(posts.length).toBe(2)
    expect(posts[0].author).toBe('Author 1')
    expect(posts[1].author).toBe('Author 1')
  })

  test('listing posts by tag should succeed', async () => {
    const posts = await listPostsByTag('tag1')
    expect(posts.length).toBe(2)
    expect(posts[0].tags).toContain('tag1')
    expect(posts[1].tags).toContain('tag1')
  })

  test('listing posts with sorting options should succeed', async () => {
    const posts = await listAllPosts({ sortBy: 'title', sortOrder: 'asc' })
    expect(posts.length).toBe(3)
    expect(posts[0].title).toBe('Post 1')
    expect(posts[1].title).toBe('Post 2')
    expect(posts[2].title).toBe('Post 3')
  })
})

describe('updating posts', () => {
  test('updating a post should succeed and update timestamp', async () => {
    const post = await createPost({ title: 'Original Title' })
    const originalUpdatedAt = post.updatedAt
    const originalCreatedAt = post.createdAt

    const updates = {
      title: 'Updated Title',
      contents: 'Updated Contents',
    }
    const updatedPost = await updatePostById(post._id, updates)
    expect(updatedPost.title).toBe(updates.title)
    expect(updatedPost.contents).toBe(updates.contents)
    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime())

    const foundPost = await Post.findById(post._id)
    expect(foundPost.title).toBe(updates.title)
    expect(foundPost.updatedAt).toEqual(updatedPost.updatedAt)
    expect(foundPost.createdAt).toEqual(originalCreatedAt)
  })

  test('updating a non-existent post should do nothing', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const result = await updatePostById(nonExistentId, { title: 'wont work' })
    expect(result).toBeNull()
  })
})

describe('deleting posts', () => {
  test('deleting a post should succeed', async () => {
    const post = await createPost({ title: 'To Be Deleted' })
    const result = await deletePostById(post._id)
    expect(result.deletedCount).toBe(1)

    const foundPost = await Post.findById(post._id)
    expect(foundPost).toBeNull()
  })

  test('deleting a non-existent post should do nothing', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const result = await deletePostById(nonExistentId)
    expect(result.deletedCount).toBe(0)
  })
})
