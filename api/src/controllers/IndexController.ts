import { spawn } from 'child_process'
import { NextFunction, Request, Response } from 'express'

export default class IndexController {
  async index (req: Request, res: Response, next: NextFunction) {
    res.send('Index controller')
  }

  async runScraper (req: Request, res: Response, next: NextFunction) {
    try {
      const { pages } = req.body

      const python = spawn('python/scraper-env/Scripts/python.exe', ['python/scraper.py', `${pages}`])

      let logs: string[] = []

      python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
        logs.push(data.toString())
      })

      python.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`)
        logs.push(data.toString())
      })

      python.on('close', (code) => {
        console.log(`child process exited with code ${code}`)
        logs.push(`child process exited with code ${code}`)

      })
      res.send({
        message: 'Scraper started successfully, scraping ' + pages + ' pages',
      })

    } catch (e) {
      res.send({
        message: 'Error starting scraper',
        error: e,
      })
    }
  }
}
