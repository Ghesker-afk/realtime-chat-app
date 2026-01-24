import { query } from "../../db/db.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";


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

export async function createReply(params: {
  threadId: number;
  authorUserId: number;
  body: string;
}) {
  const {body, threadId, authorUserId} = params;

  const result = await query(
    `
    INSERT INTO replies (thread_id, author_user_id, body)
    VALUES ($1, $2, $3)
    RETURNING id, created_at
    `,
    [threadId, authorUserId, body]
  );

  const row = result.rows[0];

  const fullResult = query(
    `
    SELECT
      r.id,
      r.body,
      r.created_at,
      u.display_name AS author_display_name,
      u.handle AS author_handle
    FROM replies r
    INNER JOIN users AS u
    ON u.id = r.author_user_id
    WHERE r.id = $1
    LIMIT 1
    `,
    [row.id]
  );

  const replyRow = (await fullResult).rows[0];

  return {
    id: replyRow.id as number,
    body: replyRow.body as string,
    createdAt: replyRow.created_at as Date,
    author: {
      displayName: (replyRow.author_display_name as string) ?? null,
      handle: (replyRow.author_handle as string) ?? null
    }
  }

}

export async function findReplyAuthor(replyId: number) {
  const result = await query(
    `
    SELECT author_user_id
    FROM replies
    WHERE id = $1
    LIMIT 1
    `,
    [replyId]
  );

  const row = result.rows[0];

  if (!row) {
    throw new NotFoundError("Reply not found!");
  }

  return row.author_user_id as number;
}