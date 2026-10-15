import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  return res.status(500).json({
    status: false,
    message: error instanceof Error ? error.message : "Internal server error",
  });
};
