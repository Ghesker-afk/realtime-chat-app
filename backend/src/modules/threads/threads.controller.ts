import { getAuth } from "@clerk/express";
import catchErrors from "../../utils/catchErrors.js";
import { createThread, listCategories, listThreads, parseThreadListFilter } from "./threads.repository.js";
import { BadRequestError, UnauthorizedError } from "../../utils/errors.js";
import { getUserFromClerk } from "../users/user.service.js";
import { CREATED, OK } from "../../constants/http.js";
import { createThreadSchema } from "./threads.schemas.js";
import { getThreadDetailsWithCounts } from "./replies.repository.js";


export const getCategoriesHandler = catchErrors(
  async(_req, res, _next) => {
    const extractListOfCategories = await listCategories();
    res.json({ data: extractListOfCategories });
});

export const createThreadHandler = catchErrors(
  async(req, res, _next) => {

    const auth = getAuth(req);

    // if you aren't authenticated, you can't create
    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const parsedBody = createThreadSchema.parse(req.body);

    const profile = await getUserFromClerk(auth.userId);

    const newlyCreatedThread = await createThread({
      categorySlug: parsedBody.categorySlug,
      authorUserId: profile.user.id,
      title: parsedBody.title,
      body: parsedBody.body
    });

    res.status(CREATED).json({ data: newlyCreatedThread });
});

export const getThreadsHandler = catchErrors(
  async(req, res, _next) => {
  
    const filter = parseThreadListFilter({
      page: req.query.page,
      pageSize: req.query.pageSize,
      category: req.query.category,
      q: req.query.q,
      sort: req.query.sort
    });

    const extractListOfThreads = await listThreads(filter);

    res.status(OK).json({ data: extractListOfThreads });
  }
);

export const getThreadHandler = catchErrors(
  async(req, res, _next) => {
  
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
  }
);