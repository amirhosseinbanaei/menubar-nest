import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CheckQueryLanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const allowedLanguages = ['en', 'fa'];

    if (req.method === 'GET') {
      const lang = req.query.lang as string | undefined;
      if (lang && !allowedLanguages.includes(lang)) {
        return res.status(400).json({
          status: 'error',
          message: `${lang} language_code not exist.`,
        });
      }
    }

    return next();
  }
}
