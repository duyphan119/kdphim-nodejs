import countryController from '@/controllers/country.controller';
import { Router } from 'express';

const countryRouter = Router();

countryRouter.get('/:slug', countryController.getVideos);
countryRouter.get('/', countryController.getCountries);

export default countryRouter;
