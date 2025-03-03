import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { CategoriesService } from '../../categories/categories.service';

@Injectable()
export class CheckCategoryExistMiddleware implements NestMiddleware {
  constructor(private readonly categoryService: CategoriesService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(400).json({
        status: 'error',
        message: 'Category id is required',
      });
    }
    const category = await this.categoryService.findOne(+categoryId);
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }
    return next();
  }
}
