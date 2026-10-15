import { Router } from "express";
import authController from "@/controllers/auth.controller";
import authMiddleware from "@/middlewares/auth.middleware";

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refreshToken);
authRouter.get('/me', authMiddleware, authController.profile);
authRouter.post('/logout', authController.logout);

export default authRouter;
