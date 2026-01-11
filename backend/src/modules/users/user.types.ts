// one type for our DB, and one more we want to
// expose to the API. 

// this is the type that we are going to expose
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
}

export type UserProfile = {
  user: User;
  clerkEmail: string | null;
  clerkFullName: string | null;
}

export type UserProfileResponse = {
  id: number;
  clerkUserId: string;
  displayName: string | null;
  email: string | null;
  handle: string | null;
  avatarUrl: string | null;
  bio: string | null;
}