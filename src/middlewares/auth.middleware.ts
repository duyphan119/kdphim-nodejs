import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { responseError } from '@/lib/utils';

declare global {
  namespace Express {
    interface Request {
      authUserId?: string;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization?.match(/^Bearer\s+(\S+)$/i);
  const accessToken = authorization?.[1];

  if (!accessToken) {
    res.status(401).json(responseError('Cần cung cấp access token'));
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new Error('JWT_SECRET is not configured'));
    return;
  }

  try {
    const payload = jwt.verify(accessToken, secret);
    if (typeof payload === 'string' || typeof payload.id !== 'string') {
      res.status(401).json(responseError('Access token không hợp lệ'));
      return;
    }

    req.authUserId = payload.id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json(responseError('Access token không hợp lệ hoặc đã hết hạn'));
      return;
    }
    next(error);
  }
};

export default authMiddleware;
