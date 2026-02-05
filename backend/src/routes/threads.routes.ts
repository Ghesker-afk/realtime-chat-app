import { Router } from "express";
import { listThreads, parseThreadListFilter } from "../modules/threads/threads.repository.js";
import { getAuth } from "@clerk/express";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { getUserFromClerk } from "../modules/users/user.service.js";
import { createReply, deleteReplyById, findReplyAuthor, getThreadDetailsWithCounts, likeThreadOnce, listRepliesForThread, removeThreadOnce } from "../modules/threads/replies.repository.js";
import { CREATED, NO_CONTENT, OK } from "../constants/http.js";
import { createThreadHandler, getCategoriesHandler, getThreadsHandler } from "../modules/threads/threads.controller.js";

export const threadsRouter = Router();

// GET /categories
// Fetch the list of categories
threadsRouter.get("/categories", getCategoriesHandler);

// POST /threads 
// Creates a new thread
threadsRouter.post("/threads", createThreadHandler);

threadsRouter.get("/threads/:threadId", async(req, res, next) => {
  try {

    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) {
      throw new BadRequestError("Invalid thread id");
    }

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const profile = await getUserFromClerk(auth.userId);
    const viewerUserId = profile.user.id;
    
    const thread = await getThreadDetailsWithCounts({threadId, viewerUserId});

    res.status(OK).json({ data: thread });

  } catch (error) {
    next(error);
  }
});

threadsRouter.get("/threads", getThreadsHandler);


// Replies and Likes Endpoints
threadsRouter.get("/threads/:threadId/replies", async(req, res, next) => {
  try {

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const threadId = Number(req.params.threadId);
    const replies = await listRepliesForThread(threadId);

    res.status(OK).json({ data: replies });

  } catch (error) {
    next(error);
  }
});

threadsRouter.post("/threads/:threadId/replies", async(req, res, next) => {
  try {

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const threadId = Number(req.params.threadId);
    if (!Number.isInteger(threadId) || threadId <= 0) {
      throw new BadRequestError("Invalid thread ID");
    }

    const bodyRaw = typeof req.body?.body === "string" ? req.body.body : "";
    if (!bodyRaw) {
      throw new BadRequestError("Reply is too short!");
    }

    const profile = await getUserFromClerk(auth.userId);

    const reply = await createReply({
      threadId,
      authorUserId: profile.user.id,
      body: bodyRaw
    });

    // notification -> trigger here, but later.

    res.status(CREATED).json({ data: reply });

  } catch (error) {
    next(error);
  }
});

threadsRouter.delete("/replies/:replyId", async(req, res, next) => {
  try {

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const replyId = Number(req.params.replyId);
    if (!Number.isInteger(replyId) || replyId <= 0) {
      throw new BadRequestError("Invalid reply ID");
    }

    const profile = await getUserFromClerk(auth.userId);
    const authorUserId = await findReplyAuthor(replyId);

    if (authorUserId !== profile.user.id) {
      throw new UnauthorizedError("You can only delete you own replies!");
    }

    await deleteReplyById(replyId);

    res.status(NO_CONTENT).send();

  } catch (error) {
    next(error);
  }
});

threadsRouter.post("/threads/:threadId/like", async (req, res, next) => {
  try {

    const auth = getAuth(req);
    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) {
      throw new BadRequestError("Invalid thread ID");
    }

    const profile = await getUserFromClerk(auth.userId);

    await likeThreadOnce({
      threadId,
      userId: profile.user.id
    });

    // notification -> logic but later

    res.status(OK).send();

  } catch (error) {
    next(error);
  }
});

threadsRouter.delete("/threads/:threadId/like", async (req, res, next) => {
  try {

    const auth = getAuth(req);
    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const threadId = Number(req.params.threadId);

    if (!Number.isInteger(threadId) || threadId <= 0) {
      throw new BadRequestError("Invalid thread ID");
    }

    const profile = await getUserFromClerk(auth.userId);

    await removeThreadOnce({
      threadId,
      userId: profile.user.id
    });

    res.status(NO_CONTENT).send();

  } catch (error) {
    next(error);
  }
});