import express, { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import IndexController from '../controllers/IndexController.js'
import { authScraper } from '../middlewares/auth.js'

const router = express.Router()
const controller = new IndexController()

router.get('/', controller.index)

router.post('/run-scraper', authScraper, controller.runScraper)

router.get('/upsert-from-files', controller.upsertScrapedContent)

router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})


export default router