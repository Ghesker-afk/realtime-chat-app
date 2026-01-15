import { Router } from "express";
import { listCategories } from "../modules/threads/threads.repository.js";
import { getAuth } from "@clerk/express";
import { UnauthorizedError } from "../lib/errors.js";
import { z } from "zod";

export const threadsRouter = Router();

const CreatedThreadSchema = z.object({
  title: z.string().trim().min(5).max(200),
  body: z.string().trim().min(10).max(2000),
  categorySlug: z.string().trim().min(1)
})

// fetch the list of categories
// 

threadsRouter.get("/categories", async(_req, res, next) => {
  try {
    
    const extractListOfCategories = await listCategories();
    res.json({ data: extractListOfCategories });

  } catch (error) {
    next(error);
  }
});

threadsRouter.post("/threads", async(req, res, next) => {
  try {

    const auth = getAuth(req);

    // if you aren't authenticated, you can't create
    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const parsedBody = CreatedThreadSchema.parse(req.body);

    const profile = await getUserFromClerk(auth.userId);

    const newlyCreatedThread = await createThread({
      categorySlug: parsedBody.categorySlug,
      authorUserId: profile.user.id,
      title: parsedBody.title,
      body: parsedBody.body
    });

    res.status(201).json({ data: newlyCreatedThread });

  } catch (error) {
    next(error);
  }
})