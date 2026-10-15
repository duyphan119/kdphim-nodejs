import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiClient = axios.create({
  baseURL: `${process.env.API_DOMAIN}/v1/api`,
});

apiClient.interceptors.response.use(({ data }) => data);

const mockClient = axios.create({
  baseURL: process.env.MOCK_API_ENDPOINT,
});

mockClient.interceptors.response.use(({ data }) => data);

const tmdbClient = axios.create({
  baseURL: process.env.TMDB_API_DOMAIN,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    Accept: "application/json",
  },
});

tmdbClient.interceptors.response.use(({ data }) => data);

export { apiClient, tmdbClient, mockClient };
