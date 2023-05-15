import express, { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import createError from 'http-errors'
import ContextController from '../controllers/ContextController.js'
import { authScraper } from '../middlewares/auth.js'

const router = express.Router()
const controller = new ContextController()

const scraperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests to scraper, please try again later.',
})

router.get('/', controller.index)
router.get('/data', controller.data)

router.post('/run-scraper', authScraper, scraperLimiter, controller.runScraper)
router.post('/upload-scraped', authScraper, controller.uploadScrapedContent)
router.post('/get-context', authScraper, controller.getContext)

router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})

export default router
