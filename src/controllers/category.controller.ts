import { responseSuccess } from '@/lib/utils';
import categoryService from '@/services/category.service';
import { Request, Response } from 'express';

const categoryController = {
  getCategories: async (req: Request, res: Response) => {
    const categories = await categoryService.getCategories();

    return res.json(responseSuccess(categories));
  },
  getVideos: async (req: Request, res: Response) => {
    const videosData = await categoryService.getVideos(req.params.slug as string, req.query);

    return res.json(responseSuccess(videosData));
  },
};

export default categoryController;
