import { Router } from "express";
import { z } from "zod";
import { toUserProfileResponse, UserProfile, UserProfileResponse } from "../modules/users/user.types.js";
import { getAuth } from "@clerk/express";
import { UnauthorizedError } from "../utils/errors.js";
import { getUserFromClerk, updateUserProfile } from "../modules/users/user.service.js";
import { OK } from "../constants/http.js";

export const userRouter = Router();

// User Update Schema
const UserProfileUpdateSchema = z.object({
  displayName: z.string().trim().max(50).optional(),
  handle: z.string().trim().max(30).optional(),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z.url("Avatar must be a valid url").optional()
});

function toResponse(profile: UserProfile) : UserProfileResponse {
  return toUserProfileResponse(profile);
}

// GET /api/me
// This endpoint will give your own profile information.

userRouter.get("/", async(req, res, next) => {
  try {

    const auth = getAuth(req);
    
    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    const profile = await getUserFromClerk(auth.userId);
    const response = toResponse(profile);

    res.status(OK).json({ data: response });

  } catch (error) {
    next(error);
  }
});

// PATCH /api/me
// This endpoint is to you update some information about you.

userRouter.patch("/", async (req, res, next) => {
  try {
    // first, we need to verify if the user is authenticated
    // or not
    const auth = getAuth(req);

    if (!auth.userId) {
      throw new UnauthorizedError("Unauthorized");
    }

    // we are going to do a basic body validation with
    // the body response received from the UI side
    const parsedBody = UserProfileUpdateSchema.parse(req.body);


    const displayName = parsedBody.displayName && parsedBody.displayName.trim().length > 0 ? parsedBody.displayName.trim() : undefined;

    const handle = parsedBody.handle && parsedBody.handle.trim().length > 0 ? parsedBody.handle.trim() : undefined;

    const bio = parsedBody.bio && parsedBody.bio.trim().length > 0 ? parsedBody.bio.trim() : undefined;

    const avatarUrl = parsedBody.avatarUrl && parsedBody.avatarUrl.trim().length > 0 ? parsedBody.avatarUrl.trim() : undefined;

    try {
      const profile = await updateUserProfile({
        clerkUserId: auth.userId,
        displayName,
        handle,
        bio,
        avatarUrl
      });

      const response = toResponse(profile);

      res.status(OK).json({
        data: response
      });
    } catch (err: any) {
      throw err;
    }
  } catch (err: any) {
    next(err);
  }
})