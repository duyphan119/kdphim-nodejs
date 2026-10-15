import { apiClient } from '@/lib/axios';

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
