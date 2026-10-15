import categoryController from '@/controllers/category.controller';
import { Router } from 'express';

const categoryRouter = Router();

categoryRouter.get('/:slug', categoryController.getVideos);
categoryRouter.get('/', categoryController.getCategories);

export default categoryRouter;
