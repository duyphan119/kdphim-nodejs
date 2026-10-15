import { apiClient } from "@/lib/axios";
import { T_BreadcrumbItem, T_Movie, T_SeoOnPage } from "@/types";

const getVideoDetail = async (slug: string) => {
  const response = await apiClient.get(`/phim/${slug}`);

  if (!response.status) return null;

  return response.data as {
    seoOnPage: T_SeoOnPage;
    item: T_Movie;
    breadCrumb: T_BreadcrumbItem[];
  };
};

const videoService = {
  getVideoDetail,
};

export default videoService;
