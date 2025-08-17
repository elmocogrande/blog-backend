import mongoose from 'mongoose'

/** DATA LAYER */

export function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL

  // listener
  mongoose.connection.on('open', () => {
    console.info('Successfully connected to database', DATABASE_URL)
  })

  // connection
  return mongoose.connect(DATABASE_URL)
}
