import { UserProfile } from "./user.types.js";


export async function updateUserProfile(params: {
  clerkUserId: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string
}) : Promise<UserProfile>{
  const {clerkUserId, displayName, handle, bio, avatarUrl} = params;

  const updatedUser = await repoUpdateUserProfile({clerkUserId, displayName, handle, bio, avatarUrl});
}