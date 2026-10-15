import { mockClient } from "@/lib/axios";

const getFavorites = async (
  userId: string,
  queryParams?: { page?: string | number; limit?: string | number },
) => {
  const favorites: T_Favorite[] = await mockClient.get("/favorites", {
    params: {
      page: queryParams?.page || 1,
      limit: queryParams?.limit || 15,
    },
  });

  const userFavorites = favorites.filter((item) => item.userId === userId);

  return userFavorites;
};

const addToFavoriteList = async (userId: string, videoSlug: string) => {
  const favorites: T_Favorite[] = await mockClient.get("/favorites");

  const existingFavorite = favorites.find(
    (item) => item.videoSlug === videoSlug && item.userId === userId,
  );

  if (existingFavorite) return existingFavorite;

  const created = await mockClient.post("/favorites", { userId, videoSlug });

  return created;
};

const removeFavoriteItem = async (id: string) => {
  const deleted = await mockClient.delete(`/favorites/${id}`);

  return deleted ? true : false;
};

const favoriteService = { getFavorites, addToFavoriteList, removeFavoriteItem };

export default favoriteService;
