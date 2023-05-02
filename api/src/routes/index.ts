import express, { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import ContextController from '../controllers/ContextController.js'
import { authScraper } from '../middlewares/auth.js'

const router = express.Router()
const controller = new ContextController()

router.get('/', controller.index)

router.post('/run-scraper', authScraper, controller.runScraper)
router.post('/upload-scraped', authScraper, controller.uploadScrapedContent)
router.post('/get-context', authScraper, controller.getContext)

router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})


export default router