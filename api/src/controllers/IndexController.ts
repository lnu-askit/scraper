import { Request, Response, NextFunction } from 'express'


export default class IndexController {
  async index(req: Request, res: Response, next: NextFunction) {
    res.send('Index controller')
  }
}