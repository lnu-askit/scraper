import dotenv from 'dotenv'
import express, { Express } from 'express'
import logger from 'morgan'
import router from './src/routes/index.js'
dotenv.config()

const run = async () => {
  const server: Express = express()
  const port = process.env.PORT || 3000

  server.use(logger('dev'))
  server.use(express.json())

  server.use('/api', router)

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
  })
}

try {
  run()
} catch (error) {
  console.error(error)
}


