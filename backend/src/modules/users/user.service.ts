import { repoUpdateUserProfile } from "./user.repository.js";
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

  const {fullName, email} = await fetchClerkProfile(clerkUserId);

  return {
    user: updatedUser,
    clerkEmail: email,
    clerkFullName: fullName
  };
}