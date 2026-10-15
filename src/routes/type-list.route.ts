import typeListController from "@/controllers/type-list.controller";
import { Router } from "express";

const typeListRouter = Router();

typeListRouter.get("/:type", typeListController.getVideos);
typeListRouter.get("/", typeListController.getTypeList);

export default typeListRouter;
