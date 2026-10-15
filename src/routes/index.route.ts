import { Router } from "express";
import countryRouter from "./country.route";
import videoRouter from "./video.route";
import homeController from "@/controllers/home.controller";
import categoryRouter from "./category.route";
import authRouter from "./auth.route";
import favoriteRouter from "./favorite.route";
import typeListRouter from "./type-list.route";
import castRouter from "./cast.route";

const rootRouter = Router();

rootRouter.use("/phim", videoRouter);
rootRouter.use("/quoc-gia", countryRouter);
rootRouter.use("/the-loai", categoryRouter);
rootRouter.use("/auth", authRouter);
rootRouter.use("/danh-sach", typeListRouter);
rootRouter.use("/favorites", favoriteRouter);
rootRouter.use("/dien-vien", castRouter);

rootRouter.get("/home", homeController.getHome);

export default rootRouter;
