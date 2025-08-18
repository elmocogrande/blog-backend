import { createUser, loginUser } from '../services/users.js'

export function userRoutes(app) {
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      return res.status(201).json({ username: user.username })
    } catch (e) {
      console.error(e)
      return res.status(400).json({
        error: 'Failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const token = await loginUser(req.body)
      return res.status(200).send({ token })
    } catch (e) {
      console.error(e)
      return res.status(400).send({
        error:
          'Failed to login, did you enter the correct username and password?',
      })
    }
  })
}
