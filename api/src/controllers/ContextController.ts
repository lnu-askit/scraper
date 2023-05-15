import axios from 'axios'
import { spawn } from 'child_process'
import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import createError from 'http-errors'

interface PineconePrepMetadata {
  url: string
  source_id: string
  created_at: Date
}

interface PineconePrep {
  id: string
  text: string
  metadata: PineconePrepMetadata
}

interface ContextResponse {
  information: string
  url: string
}

export default class ContextController {
  async index(req: Request, res: Response, next: NextFunction) {
    res.send('Index controller')
  }

  async data(req: Request, res: Response, next: NextFunction) {
    try {
      const scrapedContent = JSON.parse(
        fs.readFileSync('./workfiles/raw_info.json').toString()
      )
      res.status(200).send(scrapedContent.informationBlobs)
    } catch (error) {
      res.status(404).send([])
    }
  }

  async runScraper(req: Request, res: Response, next: NextFunction) {
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
    } catch (err: any) {
      next(createError(500, `SCRAPER_ERROR: ${err.message}`))
    }
  }

  async uploadScrapedContent(req: Request, res: Response, next: NextFunction) {
    try {
      // TODO: Make sure it works with larger batches of data.
      const scrapedContent = JSON.parse(
        fs.readFileSync('./workfiles/raw_info.json').toString()
      )
      const infoBlobs = scrapedContent.informationBlobs
      const pineconePrep: PineconePrep[] = []

      for (let i = 0; i < infoBlobs.length; i++) {
        const title: string = infoBlobs[i].title
        const text: string = infoBlobs[i].content
        const url: string = infoBlobs[i].url
        const id: string = (url + title).replace(/\W+/g, 'X')
        let currentPrep: PineconePrep = {
          id: id,
          text: text,
          metadata: {
            source_id: id,
            url: url,
            created_at: new Date(),
          },
        }
        pineconePrep.push(currentPrep)
      }

      const retrievalUrl = 'http://retrieval-plugin:8080'

      const payload = {
        documents: pineconePrep,
      }
      const response = await axios.post(retrievalUrl + '/upsert', payload, {
        headers: {
          Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
        },
      })

      res.send({
        pineconeResponse: response.status,
        dataUploaded: pineconePrep,
      })
    } catch (err: any) {
      next(err)
    }
  }

  async getContext(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        currentQuery,
        maxTokens,
      }: { currentQuery: string; maxTokens: number } = req.body
      const chunkSize = 300
      const retrievalUrl = 'http://retrieval-plugin:8080'
      const payload = {
        queries: [
          {
            query: currentQuery,
            top_k: Math.floor(maxTokens / chunkSize),
          },
        ],
      }
      const response = await axios.post(retrievalUrl + '/query', payload, {
        headers: {
          Authorization: 'Bearer ' + process.env.BEARER_TOKEN,
        },
      })

      const results = response.data.results[0]?.results
      let result: ContextResponse[] = []
      for (let i = 0; i < results.length; i++) {
        result.push({
          information: results[i].text,
          url: results[i].metadata.url,
        })
      }

      res.send({
        context: result,
      })
    } catch (err: unknown) {
      next(err)
    }
  }
}
