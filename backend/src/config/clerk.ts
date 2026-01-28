import type { Response, Request, NextFunction } from "express";
import { clerkMiddleware, getAuth, clerkClient } from "@clerk/express";
import { UnauthorizedError } from "../lib/errors.js";

export {clerkMiddleware, clerkClient, getAuth}

export function requireAuthApi(req: Request, _res: Response, next: NextFunction) : void {

  // First, we must check if the user is authenticated or not
  const auth = getAuth(req);

  // If the auth doesn't have the user ID, that means the 
  // user isn't authenticated!
  if (!auth.userId) {
    return next(new UnauthorizedError("You must be signed in to access this resource!"));
  }

  return next();
}