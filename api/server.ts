import dotenv from 'dotenv'
import express, { Express, NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import logger from 'morgan'
import router from './src/routes/index.js'
dotenv.config()

const run = async () => {
  const server: Express = express()
  const port = process.env.PORT || 3000

  server.use(logger('dev'))
  server.use(express.json())

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  })

  server.use(limiter)

  server.use('/api', router)

  server.use((err: { code?: number; status: number; message: string; stack: string }, req: Request, res: Response, next: NextFunction) => {
    interface ErrorResponse {
      status: number
      message: string
      stack?: string
    }

    const errorResponse: ErrorResponse = {
      status: err.status || 500,
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
    }

    res.status(errorResponse.status).json(errorResponse)
  })

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}

try {
  run()
} catch (error) {
  console.error(error)
}


