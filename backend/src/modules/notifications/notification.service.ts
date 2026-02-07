import { query } from "../../db/db.js";
import { mapNotificationsRow, NotificationRow } from "./notifications.types.js";

type ActivityReplyParams = {
  threadId: number;
  actorUserId: number;
};

export const createCommentNotification = async (replyParams: ActivityReplyParams) => {

  const { threadId, actorUserId } = replyParams;

  // First, we must find the author (and note that the actor
  // user is the user that has commented on the author's 
  // thread).
  const threadResponse = await query<{ author_user_id: number; }>(
    `
    SELECT author_user_id
    FROM threads
    WHERE id = $1
    LIMIT 1
    `,
    [threadId]
  );

  const row = threadResponse.rows[0];

  if (!row) {
    // Thread not found, so no notification created!
    return;
  }

  const authorUserId = row.author_user_id;

  // If you like your own post, you will not going to send
  // any notification.
  if (authorUserId === actorUserId) {
    return;
  }

  const insertResponse = await query<{ id: number; created_at: Date; }>(
    `
    INSERT INTO notifications (user_id, actor_user_id, thread_id, type)
    VALUES ($1, $2, $3, 'REPLY_ON_THREAD')
    RETURNING id, created_at
    `,
    [authorUserId, actorUserId, threadId]
  );

  const notificationRow = insertResponse.rows[0];

  if (!notificationRow) {
    return;
  }

  const notificationId = notificationRow.id;

  const fullResponse = await query<NotificationRow>(
    `
    SELECT
      n.id,
      n.type,
      n.thread_id,
      n.created_at,
      n.read_at,
      actor.display_name AS actor_display_name,
      actor.handle AS actor_handle,
      t.title AS thread_title
    FROM notifications n
    INNER JOIN users actor
    ON actor.id = n.actor_user_id
    INNER JOIN threads t
    ON t.id = n.thread_id
    WHERE n.id = $1
    LIMIT 1
    `,
    [notificationId]
  );

  const fullRow = fullResponse.rows[0];

  if (!fullRow) {
    return;
  }

  const payload = mapNotificationsRow(fullRow);

  // Then, we will emit our first Socket
  // event.
};

export const createLikeNotification = async (replyParams: ActivityReplyParams) => {

  const { threadId, actorUserId } = replyParams;

  // First, we must find the author (and note that the actor
  // user is the user that has commented on the author's 
  // thread).
  const threadResponse = await query<{ author_user_id: number; }>(
    `
    SELECT author_user_id
    FROM threads
    WHERE id = $1
    LIMIT 1
    `,
    [threadId]
  );

  const row = threadResponse.rows[0];

  if (!row) {
    // Thread not found, so no notification created!
    return;
  }

  const authorUserId = row.author_user_id;

  // If you like your own post, you will not going to send
  // any notification.
  if (authorUserId === actorUserId) {
    return;
  }

  const insertResponse = await query<{ id: number; created_at: Date; }>(
    `
    INSERT INTO notifications (user_id, actor_user_id, thread_id, type)
    VALUES ($1, $2, $3, 'LIKE_ON_THREAD')
    RETURNING id, created_at
    `,
    [authorUserId, actorUserId, threadId]
  );

  const notificationRow = insertResponse.rows[0];

  if (!notificationRow) {
    return;
  }

  const notificationId = notificationRow.id;

  const fullResponse = await query<NotificationRow>(
    `
    SELECT
      n.id,
      n.type,
      n.thread_id,
      n.created_at,
      n.read_at,
      actor.display_name AS actor_display_name,
      actor.handle AS actor_handle,
      t.title AS thread_title
    FROM notifications n
    INNER JOIN users actor
    ON actor.id = n.actor_user_id
    INNER JOIN threads t
    ON t.id = n.thread_id
    WHERE n.id = $1
    LIMIT 1
    `,
    [notificationId]
  );

  const fullRow = fullResponse.rows[0];

  if (!fullRow) {
    return;
  }

  const payload = mapNotificationsRow(fullRow);

  // Then, we will emit our first Socket
  // event.
};

type NotificationsParams = {
  userId: number;
  unreadOnly: boolean;
};

export const listNotificationsForUser = async (notificationsParams: NotificationsParams) : Promise<NotificationRow[]> => {

  const { userId, unreadOnly } = notificationsParams;

  const conditions = ["n.user_id = $1"];
  const values: readonly unknown[] = [userId];

  if (unreadOnly) {
    conditions.push("n.read_at IS NULL");
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const result = await query<NotificationRow>(
    `
    SELECT
      n.id,
      n.type,
      n.thread_id,
      n.created_at,
      n.read_at,
      actor.display_name AS actor_display_name,
      actor.handle AS actor_handle,
      t.title AS thread_title
    FROM notifications n
    INNER JOIN users actor
    ON actor.id = n.actor_user_id
    INNER JOIN threads t
    ON t.id = n.thread_id
    ${whereClause}
    ORDER BY n.created_at DESC 
    `,
    values
  );

  return result.rows.map(notification => mapNotificationsRow(notification));
};