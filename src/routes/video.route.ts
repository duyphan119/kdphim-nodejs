import videoController from '@/controllers/video.controller';
import { Router } from 'express';

const videoRouter = Router();

videoRouter.get('/:slug', videoController.getVideoDetail);

export default videoRouter;
