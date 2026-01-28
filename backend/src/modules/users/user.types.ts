// One user type is for our database, and the other
// are the one we want to expose to the API.

export type UserRow = {
  id: number;
  clerk_user_id: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
};

// We convert the snake_case from Postgres to camelCase
// in our API!

// This is the type that we are going to expose
// to the API layer.

export type User = {
  id: number;
  clerkUserId: string;
  displayName: string | null;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// This is the shape of the profile that we want to expose
// from our service layer (API).
export type UserProfile = {
  user: User;
  clerkEmail: string | null;
  clerkFullName: string | null;
};

// This is the structure that we want to return back.
export type UserProfileResponse = {
  id: number;
  clerkUserId: string;
  displayName: string | null;
  email: string | null;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
};

// Helper function to convert the user profile to the
// type that suits more for the response (UserResponse)
export function toUserProfileResponse(profile: UserProfile) : UserProfileResponse {

  const {user, clerkEmail, clerkFullName} = profile;

  return {
    id: user.id,
    clerkUserId: user.clerkUserId,
    email: clerkEmail ?? null,
    displayName: user.displayName ?? clerkFullName ?? null,
    handle: user.handle ?? null,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null
  };
}