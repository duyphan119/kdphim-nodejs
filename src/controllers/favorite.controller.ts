import { responseError, responseSuccess } from "@/lib/utils";
import favoriteService from "@/services/favorite.service";
import videoService from "@/services/video.service";
import { T_Movie } from "@/types";
import { Request, Response } from "express";

const favoriteController = {
  add: async (req: Request, res: Response) => {
    const created = await favoriteService.addToFavoriteList(
      req.authUserId!,
      req.body.videoSlug,
    );

    return res.json(responseSuccess(created));
  },
  remove: async (req: Request, res: Response) => {
    const id = req.params.id;
    if (typeof id !== "string") {
      return res.status(400).json(responseError("Favorite ID không hợp lệ"));
    }

    const deleted = await favoriteService.removeFavoriteItem(id);

    return res.json(responseSuccess(deleted));
  },
  getVideos: async (req: Request, res: Response) => {
    const userFavorites = await favoriteService.getFavorites(
      req.authUserId!,
      req.query,
    );
    let videos: T_Movie[] = [];
    if (req.query.include_videos) {
      videos = (
        await Promise.all(
          userFavorites.map((item) =>
            videoService.getVideoDetail(item.videoSlug),
          ),
        )
      )
        .map((data) => data?.item)
        .filter((item) => item) as T_Movie[];
    }

    return res.json(responseSuccess({ userFavorites, videos }));
  },
};

export default favoriteController;
