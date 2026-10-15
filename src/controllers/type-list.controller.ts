import { responseSuccess } from "@/lib/utils";
import typeListService from "@/services/type-list.service";
import { Request, Response } from "express";

const typeListController = {
  getTypeList: (req: Request, res: Response) => {
    const categories = typeListService.getTypeList();

    return res.json(responseSuccess(categories));
  },
  getVideos: async (req: Request, res: Response) => {
    const videosData = await typeListService.getVideos(
      req.params.type as string,
      req.query as any,
    );

    return res.json(responseSuccess(videosData));
  },
};

export default typeListController;
