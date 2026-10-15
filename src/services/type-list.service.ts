import { apiClient } from "@/lib/axios";
import { T_Filter } from "@/types";

const typeList = [
  { name: "Phim lẻ", slug: "phim-le" },
  { name: "Phim bộ", slug: "phim-bo" },
  { name: "Hoạt hình", slug: "hoat-hinh" },
  { name: "TV Shows", slug: "tv-shows" },
];

const getTypeList = () => typeList;

const getVideos = async (
  type: string,
  params?: Omit<T_Filter, "type_slug">,
) => {
  const { data } = await apiClient.get(`/danh-sach/${type}`, {
    params: params || {},
  });

  return data;
};

const typeListService = { getTypeList, getVideos };

export default typeListService;
