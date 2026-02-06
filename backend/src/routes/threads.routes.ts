import { Router } from "express";
import { createThreadHandler, getCategoriesHandler, getThreadHandler, getThreadsHandler } from "../modules/threads/threads.controller.js";
import { addLikeHandler, deleteReplyHandler, generateReplyHandler, getRepliesHandler, removeLikeHandler } from "../modules/threads/replies.controller.js";

export const threadsRouter = Router();

// GET /categories
// Fetch the list of categories.
threadsRouter.get("/categories", getCategoriesHandler);

// POST /threads 
// Creates a new thread.
threadsRouter.post("/threads", createThreadHandler);

// GET /threads/:threadId
// Get a specific thread.
threadsRouter.get("/threads/:threadId", getThreadHandler);

// GET /threads
// Get all the threads of a specific user.
threadsRouter.get("/threads", getThreadsHandler);


// Replies and Likes Endpoints

// GET /threads/:threadId/replies
// Get all the replies on a specific thread.
threadsRouter.get("/threads/:threadId/replies", getRepliesHandler);

// POST /threads/:threadId/replies
// Create a new reply.
threadsRouter.post("/threads/:threadId/replies", generateReplyHandler);

// DELETE /replies/:replyId
// Delete a reply on a thread.
threadsRouter.delete("/replies/:replyId", deleteReplyHandler);

// POST /threads/:threadId/like
// Adds a like on a thread.
threadsRouter.post("/threads/:threadId/like", addLikeHandler);

// DELETE /threads/:threadId/like
// Removes a like on a thread.
threadsRouter.delete("/threads/:threadId/like", removeLikeHandler);