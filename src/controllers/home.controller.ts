import { responseSuccess } from "@/lib/utils";
import countryService from "@/services/country.service";
import videoService from "@/services/video.service";
import { Request, Response } from "express";

const homeController = {
  getHome: async (req: Request, res: Response) => {
    const currentYear = new Date().getFullYear();
    const [{ items: chinaVideos }, { items: koreaVideos }, hotVideosData] =
      await Promise.all([
        countryService.getVideos("trung-quoc", {
          limit: 8,
          year: currentYear,
        }),
        countryService.getVideos("han-quoc", {
          limit: 7,
          year: currentYear,
        }),
        Promise.all([
          videoService.getVideoDetail("cho-hoang-va-xuong"),
          videoService.getVideoDetail("dau-xuan-tuoi-sang"),
          videoService.getVideoDetail("nhat-au-xuan"),
          videoService.getVideoDetail("thien-huong"),
          videoService.getVideoDetail("trieu-tuyet-luc"),
          videoService.getVideoDetail("tu-da-quy"),
        ]),
      ]);

    return res.json(
      responseSuccess({
        featuredVideo: hotVideosData[0]?.item || null,
        latestVideos: [...chinaVideos.slice(0, 3), ...koreaVideos.slice(0, 2)],
        chinaVideos: chinaVideos.slice(3, 8),
        koreaVideos: koreaVideos.slice(2, 7),
        hotVideos: hotVideosData
          .slice(1, 6)
          .map((item) => item?.item)
          .filter((item) => item),
      }),
    );
  },
};

export default homeController;
