import { apiClient } from '@/lib/axios';

const getCountries = async () => {
  const response = await apiClient.get('/quoc-gia');

  return response.data.items as T_Country[];
};

const getVideos = async (countrySlug: string, params?: any) => {
  const response = await apiClient.get(`/quoc-gia/${countrySlug}`, { params });

  return response.data;
};

const countryService = {
  getCountries,
  getVideos,
};

export default countryService;
