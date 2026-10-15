import castController from "@/controllers/cast.controller";
import { Router } from "express";

const castRouter = Router();

castRouter.get("/dien-vien/:id", castController.getProfile);

export default castRouter;
