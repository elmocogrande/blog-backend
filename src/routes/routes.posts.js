import * as postServices from '../services/posts.js'

/** ROUTING LAYER */

export function postsRoutes(app) {
  // GET
  app.get('/api/v1/posts', async (req, res) => {
    const { author, tag, sortBy, sortOrder } = req.query
    const options = { sortBy, sortOrder }

    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'Query by author or tag, not both' })
      } else if (author) {
        return res.json(await postServices.listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await postServices.listPostsByTag(tag, options))
      } else {
        return res.json(await postServices.listAllPosts(options))
      }
    } catch (e) {
      console.error('Error listing posts', e)
      return res.status(500).end()
    }
  })

  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await postServices.getPostById(id)
      if (post === null) return res.status(404).end()

      return res.json(post)
    } catch (e) {
      console.error('Error getting post', e)
      return res.status(500).end()
    }
  })

  // POST/PUT
  app.post('/api/v1/posts', async (req, res) => {
    try {
      const post = await postServices.createPost(req.body)
      return res.json(post)
    } catch (e) {
      console.error('Error creating post', e)
      return res.status(500).end()
    }
  })

  // POST/PATCH
  app.patch('/api/v1/posts/:id', async (req, res) => {
    try {
      const post = await postServices.updatePostById(req.params.id, req.body)
      return res.json(post)
    } catch (e) {
      console.error('Error updating post', e)
      return res.status(500).end()
    }
  })

  // DELETE
  app.delete('/api/v1/posts/:id', async (req, res) => {
    try {
      const { deletedCount } = await postServices.deletePostById(req.params.id)
      if (!deletedCount) return res.sendStatus(404)

      return res.status(204).end()
    } catch (e) {
      console.error('Error deleting post', e)
      return res.status(500).end()
    }
  })
}
