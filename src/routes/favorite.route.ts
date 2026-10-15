import favoriteController from "@/controllers/favorite.controller";
import authMiddleware from "@/middlewares/auth.middleware";
import { Router } from "express";

const favoriteRouter = Router();

favoriteRouter.post("/", authMiddleware, favoriteController.add);
favoriteRouter.get("/", authMiddleware, favoriteController.getVideos);
favoriteRouter.delete("/:id", authMiddleware, favoriteController.remove);

export default favoriteRouter;
