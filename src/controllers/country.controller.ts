import { responseSuccess } from '@/lib/utils';
import countryService from '@/services/country.service';
import { Request, Response } from 'express';

const countryController = {
  getCountries: async (req: Request, res: Response) => {
    const countries = await countryService.getCountries();

    return res.json(responseSuccess(countries));
  },
  getVideos: async (req: Request, res: Response) => {
    const videosData = await countryService.getVideos(req.params.slug as string, req.query);

    return res.json(responseSuccess(videosData));
  },
};

export default countryController;
