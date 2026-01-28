// Inside this file, we have our root router, that
// will be used in our app.ts.

import { Router } from "express";
import { userRouter } from "./user.routes.js";

export const apiRouter = Router();

apiRouter.use("/me", userRouter);