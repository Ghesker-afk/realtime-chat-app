import { getAuth } from "@clerk/express";
import { Router } from "express";
import { getUserFromClerk } from "../modules/users/user.service.js";
import { listChatUsers } from "../modules/chat/chat.service.js";

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