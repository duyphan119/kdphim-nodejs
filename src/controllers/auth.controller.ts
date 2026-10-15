import { AUTH_COOKIE_NAME, responseError, responseSuccess } from "@/lib/utils";
import { AuthError } from "@/services/auth.service";
import authService from "@/services/auth.service";
import { Request, Response } from "express";

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 360;
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: COOKIE_MAX_AGE,
  path: "/auth",
};
const { maxAge: _maxAge, ...clearCookieOptions } = cookieOptions;

const getRefreshToken = (req: Request): string => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return "";

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`));

  return cookie ? cookie.slice(AUTH_COOKIE_NAME.length + 1) : "";
};

const sendAuthError = (res: Response, error: unknown) => {
  if (error instanceof AuthError) {
    return res.status(error.statusCode).json(responseError(error.message));
  }
  console.error(error);
  return res.status(500).json(responseError("Đã xảy ra lỗi máy chủ"));
};

const setRefreshCookie = (res: Response, refreshToken: string) => {
  res.cookie(AUTH_COOKIE_NAME, refreshToken, cookieOptions);
};

const sendSession = (
  res: Response,
  session: Awaited<ReturnType<typeof authService.login>>,
) => {
  setRefreshCookie(res, session.refreshToken);
  const { refreshToken: _refreshToken, ...publicSession } = session;
  return res.json(responseSuccess(publicSession));
};

const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const data = await authService.login(req.body);
      return sendSession(res, data);
    } catch (error) {
      return sendAuthError(res, error);
    }
  },
  register: async (req: Request, res: Response) => {
    try {
      const session = await authService.register(req.body);
      console.log("register api", session);
      return sendSession(res, session);
    } catch (error) {
      return sendAuthError(res, error);
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const session = await authService.refreshToken(getRefreshToken(req));
      return sendSession(res, session);
    } catch (error) {
      return sendAuthError(res, error);
    }
  },
  profile: async (req: Request, res: Response) => {
    try {
      if (!req.authUserId) {
        return res.status(401).json(responseError("Cần cung cấp access token"));
      }
      const user = await authService.profile(req.authUserId);
      return res.json(responseSuccess(user));
    } catch (error) {
      return sendAuthError(res, error);
    }
  },
  logout: (_req: Request, res: Response) => {
    res.clearCookie(AUTH_COOKIE_NAME, clearCookieOptions);
    return res.json(responseSuccess(null));
  },
};

export default authController;
