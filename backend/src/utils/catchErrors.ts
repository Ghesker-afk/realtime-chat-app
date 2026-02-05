import { NextFunction, Request, Response } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// This utility function will take a async controller and
// try to run it, and if any errors are thrown, it will catch
// it and call the next function (middleware)
const catchErrors = (controller: AsyncController) : AsyncController => async(req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    next(error);
  }
};

export default catchErrors;