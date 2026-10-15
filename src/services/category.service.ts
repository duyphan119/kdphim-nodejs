import { apiClient } from "@/lib/axios";
import { T_Category } from "@/types";

const getCategories = async () => {
  const response = await apiClient.get("/the-loai");

  return response.data.items as T_Category[];
};

const getVideos = async (categorySlug: string, params?: any) => {
  const response = await apiClient.get(`/the-loai/${categorySlug}`, { params });

  return response.data;
};

const categoryService = {
  getCategories,
  getVideos,
};

export default categoryService;
