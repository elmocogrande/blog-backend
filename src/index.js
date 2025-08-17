import { app } from './app.js'
import dotenv from 'dotenv'
import { initDatabase } from './db/init.js'

dotenv.config()

try {
  await initDatabase()
  const port = process.env.PORT
  app.listen(port, () => {
    console.log(`Backend Server is running on port ${port}`)
  })
} catch (e) {
  console.error('Error connecting to the database: ', e)
  process.exit(1)
}
