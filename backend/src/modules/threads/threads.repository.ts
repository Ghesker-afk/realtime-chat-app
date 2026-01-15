import { query } from "../../db/db.js";
import { BadRequestError } from "../../lib/errors.js";
import { Category, CategoryRow, mapCategoryRow, ThreadDetail } from "./threads.types.js";


export async function listCategories(): Promise<Category[]> {
  
  const result = await query<CategoryRow>(
    `
    SELECT id, slug, name, description 
    FROM categories
    ORDER BY name ASC
    `
  );

  return result.rows.map(mapCategoryRow);

}

export async function createThread(params: {
  categorySlug: string;
  authorUserId: number;
  title: string;
  body: string;
}) : Promise<ThreadDetail> {
  const {categorySlug, authorUserId, title, body} = params;

  const categoryRes = await query<{id: number}>(
    `]
    SELECT id
    FROM categories
    WHERE slug = $1
    LIMIT 1
    `,
    [categorySlug]
  );

  if (categoryRes.rows.length === 0) {
    throw new BadRequestError("Invalid category");
  }

  const categoryId = categoryRes.rows[0].id;

  const insertRes = await query<{id: number}>(
    `
    INSERT INTO threads (category_id, author_user_id, title, body)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [categoryId, authorUserId, title, body]
  );

  const threadId = insertRes.rows[0].id;

  return getThreadById(threadId);
}