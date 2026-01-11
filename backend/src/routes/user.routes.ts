import {Router} from "express";
import {z} from "zod";
import { UserProfile, UserProfileResponse } from "../modules/users/user.types.js";

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