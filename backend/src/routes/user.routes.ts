import {Router} from "express";
import {z} from "zod";
import { UserProfile, UserProfileResponse } from "../modules/users/user.types.js";
import { getAuth } from "@clerk/express";
import { UnauthorizedError } from "../lib/errors.js";
import { updateUserProfile } from "../modules/users/user.service.js";

export const userRouter = Router();

// User Update Schema

const UserProfileUpdateSchema = z.object({
  displayName: z.string().trim().max(50).optional(),
  handle: z.string().trim().max(30).optional(),
  bio: z.string().trim().max(500).optional(),
  avatarUrl: z.url("Avatar must be a valid url").optional()
});

function toUserProfileResponse(profile: UserProfile): UserProfileResponse {
  const {user, clerkEmail, clerkFullName} = profile;

  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: clerkEmail ?? null,
    displayName: user.displayName ?? clerkFullName ?? null,
    handle: user.handle ?? null,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null
  }
}

function toResponse(profile: UserProfile): UserProfileResponse {
  return toUserProfileResponse(profile);
}

// GET /api/me


// PATCH /api/me

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

      res.json({
        data: response
      });
    } catch (err: any) {
      throw err;
    }
  } catch (err: any) {
    next(err);
  }
})