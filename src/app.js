import express from 'express'
import cors from 'cors'
import { postsRoutes } from './routes/routes.posts.js'
import { userRoutes } from './routes/routes.users.js'
import { conditionalJson } from './middleware/conditionalJson.js'

// Create a new Express app and configure it
const app = express()
app.use(cors())
// app.use(express.json())
app.use(conditionalJson)
postsRoutes(app)
userRoutes(app)

// Export the app to be able to use it in other files
export { app }
