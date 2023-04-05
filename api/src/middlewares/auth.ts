import { NextFunction, Request, Response } from "express";

export const authScraper = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers['x-scraper-key']) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const scraperKey = req.headers['x-scraper-key'] as string;

  if (!scraperKey || scraperKey !== process.env.SCRAPER_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return next();
}