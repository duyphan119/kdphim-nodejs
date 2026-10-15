import { tmdbClient } from "@/lib/axios";
import { T_CastProfile, T_People } from "@/types";

const getPeoples = async (tmdbType: string, tmdbId: number | string) => {
  try {
    const { data } = await tmdbClient.get(
      `/${tmdbType}/${tmdbId}/credits?language=vi-VN`,
    );

    return data.cast as T_People[];
  } catch (error) {
    console.log("getPeoples error", error);
    return [];
  }
};

const getProfile = async (id: string) => {
  try {
    const data: any = await tmdbClient.get(`/person/${id}?language=vi-VN`);

    return data.cast as T_CastProfile;
  } catch (error) {
    console.log("getPeoples error", error);
    return [];
  }
};

const castService = { getPeoples, getProfile };

export default castService;
