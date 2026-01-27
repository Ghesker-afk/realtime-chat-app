import { query } from "../../db/db.js";


// the first service is to list all the users.
export async function listChatUsers(currentUserId: number) {
  try {

    const result = await query(
      `
      SELECT
        id,
        display_name,
        handle,
        avatar_url
      FROM users
      WHERE id <> $1
      ORDER BY COALESCE(display_name, handle, 'User') ASC;
      `,
      [currentUserId]
    );

    return result.rows.map((row) => ({
      id: row.id as number,
      displayName: (row.display_name as string) ?? null,
      handle: (row.handle as string) ?? null,
      avatarUrl: (row.avatar_url as string) ?? null, 
    }));

  } catch (error) {
    throw error;
  }
}

// method to render all the messages between two users