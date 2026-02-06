import { getAuth } from "@clerk/express";
import catchErrors from "../../utils/catchErrors.js";
import { BadRequestError, UnauthorizedError } from "../../utils/errors.js";
import { createReply, deleteReplyById, findReplyAuthor, likeThreadOnce, listRepliesForThread, removeThreadOnce } from "./replies.repository.js";
import { CREATED, NO_CONTENT, OK } from "../../constants/http.js";
import { getUserFromClerk } from "../users/user.service.js";

export const getRepliesHandler = catchErrors(
  async(req, res, _next) => {

    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const threadId = Number(req.params.threadId);
    const replies = await listRepliesForThread(threadId);

    res.status(OK).json({ data: replies });
});

export const generateReplyHandler = catchErrors(
  async(req, res, _next) => {
  
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
  }
);

export const deleteReplyHandler = catchErrors(
  async(req, res, _next) => {
  
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
  
  }
);

export const addLikeHandler = catchErrors(
  async (req, res, _next) => {
  
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
  }
);

export const removeLikeHandler = catchErrors(
  async (req, res, _next) => {

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
}
);