import { Request, Response } from 'express';
import axios from 'axios';
import videoService from '@/services/video.service';
import { responseError, responseSuccess } from '@/lib/utils';
import castService from '@/services/cast.service';

const videoController = {
  getVideoDetail: async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const response = await videoService.getVideoDetail(slug);
    console.log('api detail', response);
    const { include_casts } = req.query;

    if (!response) return res.json(responseError());

    // let casts: T_People[] = [];

    // if (include_casts && response.item.tmdb && response.item.tmdb.id) {
    //   casts = await castService.getPeoples(response.item.tmdb.type, response.item.tmdb.id);
    // }

    return res.json(responseSuccess({ ...response, casts: [] }));
  },
};

export default videoController;
