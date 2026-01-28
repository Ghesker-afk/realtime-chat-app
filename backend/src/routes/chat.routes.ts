import { getAuth } from "@clerk/express";
import { Router } from "express";
import { getUserFromClerk } from "../modules/users/user.service.js";
import { listChatUsers, listDirectMessages } from "../modules/chat/chat.service.js";

export const chatRouter = Router();

chatRouter.get("/", async(req, res, next) => {
  try {

    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const profile = await getUserFromClerk(auth.userId);
    const currentUserId = profile.user.id;

    const users = await listChatUsers(currentUserId);

    res.json({ data: users });

  } catch (error) {
    next(error);
  }
});

chatRouter.get("/conversations/:otherUserId/messages", async(req, res, next) => {
  try {

    const auth = getAuth(req);

    if (!auth.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const profile = await getUserFromClerk(auth.userId);
    const currentUserId = profile.user.id;

    const rawOtherUserId = req.params.otherUserId;
    const otherUserId = Number(rawOtherUserId);

    const limitParam = req.query.limit;
    const limit = typeof limitParam === "string" ? parseInt(limitParam, 10) : 100;

    const messages = await listDirectMessages({
      userId: currentUserId,
      otherUserId,
      limit: limit || 50
    });

    res.json({ data: messages });

  } catch (error) {
    next(error);
  }
});

// stop at 10:03:26