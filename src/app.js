import express from 'express'
import cors from 'cors'
import { postsRoutes } from './routes/routes.posts.js'

// Create a new Express app and configure it
const app = express()
app.use(cors())
app.use(express.json())
postsRoutes(app)

// Export the app to be able to use it in other files
export { app }
