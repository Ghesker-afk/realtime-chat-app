import { query } from "../../db/db.js";
import { BadRequestError } from "../../lib/errors.js";


export async function listRepliesForThread(threadId: number) {
  if (!Number.isInteger(threadId) || threadId <= 0) {
    throw new BadRequestError("Invalid thread ID");
  }

  const result = await query(
    `
    SELECT
      r.id,
      r.body,
      r.created_at,
      u.display_name AS author_display_name,
      u.handle AS author_handle,
    FROM replies r
    INNER JOIN users AS u
    ON u.id = r.author_user_id
    WHERE r.thread_id = $1
    ORDER BY r.created_at ASC
    `,
    [threadId]
  );

  return result.rows.map(row => ({
    id: row.id as number,
    body: row.body as string,
    createdAt: row.created_at as Date,
    author: {
      displayName: (row.author_display_name as string) ?? null,
      handle: (row.author_handle as string) ?? null
    }
  }));
}