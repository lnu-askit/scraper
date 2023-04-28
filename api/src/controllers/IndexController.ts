import { spawn } from 'child_process'
import { NextFunction, Request, Response } from 'express'
import * as fs from 'node:fs'
import { open } from 'node:fs/promises'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

export default class IndexController {
  async index (req: Request, res: Response, next: NextFunction) {
    res.send('Index controller')
  }

  async runScraper (req: Request, res: Response, next: NextFunction) {
    try {
      const { pages } = req.body

      const python = spawn('python3', ['python/scraper.py', `${pages}`])

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

  async upsertScrapedContent (req: Request, res: Response, next: NextFunction) {
    try {
      const jsonString = fs.readFileSync('./workfiles/raw_info.json', 'utf-8')
      const jsonData = JSON.parse(jsonString)
      const articleOne = jsonData.informationBlobs[0] // For testing, remove
      let files: any[] = jsonData.informationBlobs
      console.log('number of files: ', files.length)

      const responses = await Promise.all(
        files.map(async file => {
          const fileID = file.title.concat(' - ' + file.url)
          const data = {
            documents: [
              {
                text: file.content,
                metadata: {
                  source: 'email',
                  source_id: fileID,
                  url: file.url
                }
              }
            ]
          }
          //console.log('file: ', data)
          const token = process.env.BEARER_TOKEN
          const response = await fetch('http://retrieval-plugin:8080/upsert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
          })
        })
      )

      res.send({
        message: 'Done',
      })

    } catch (e) {
      console.log(e)
      res.send({
        message: 'Error',
        error: e,
      })
    }
  }
}
