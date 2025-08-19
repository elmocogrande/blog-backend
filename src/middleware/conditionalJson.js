import express from 'express'

const jsonParser = express.json()

export function conditionalJson(req, res, next) {
  // Skip JSON parsing for GET requests, as they shouldn't have a body.
  if (req.method === 'GET') {
    return next()
  }

  // For all other methods, use the Express JSON parser.
  jsonParser(req, res, next)
}
