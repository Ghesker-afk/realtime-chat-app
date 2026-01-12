// repository -> is where we write our all SQL queries
// which will interact with our DB.

import { query } from "../../db/db.js";
import { User } from "./user.types.js";

export async function repoUpdateUserProfile(params: {
  clerkUserId: string;
  displayName?: string;
  handle?: string;
  bio?: string;
  avatarUrl?: string
}) : Promise<User> {
  const {clerkUserId, displayName, handle, bio, avatarUrl} = params;

  const setClauses: string[] = [];
  const values: unknown[] = [clerkUserId]; 
  let idx = 2;

  if (typeof displayName !== undefined) {
    setClauses.push(`display_name = $${idx++}`);
    values.push(displayName);
  }

  if (typeof handle !== undefined) {
    setClauses.push(`handle = $${idx++}`);
    values.push(handle);
  }

  if (typeof bio !== undefined) {
    setClauses.push(`bio = $${idx++}`);
    values.push(bio);
  }

  if (typeof avatarUrl !== undefined) {
    setClauses.push(`avatar_url = $${idx++}`);
    values.push(avatarUrl);
  }

  setClauses.push(`updated_at = NOW()`);
  const result = await query<UserRow>(
    `
    UPDATE users
    SET ${setClauses.join(" ")}
    WHERE clerk_user_id = $1
    RETURNING 
      id,
      clerk_user_id,
      display_name,
      handle,
      avatar_url,
      bio,
      created_at,
      updated_at
    `,
    values
  );

  if (result.rows.length === 0) {
    throw new Error(`No user found for clerk user id = ${clerkUserId}`);
  }

  return hydrateUser(result.rows[0]);
}