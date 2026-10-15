import { responseSuccess } from "@/lib/utils";
import castService from "@/services/cast.service";
import { Request, Response } from "express";

const castController = {
  getProfile: async (req: Request, res: Response) => {
    const data = await castService.getProfile(req.params.id + "");

    return res.json(responseSuccess(data));
  },
};

export default castController;
