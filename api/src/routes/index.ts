import express, { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import IndexController from '../controllers/IndexController.js'

const router = express.Router()
const controller = new IndexController()

router.get('/', controller.index)

router.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(createError(404))
})


export default router