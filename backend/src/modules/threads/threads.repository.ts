import { query } from "../../db/db.js";
import { Category, CategoryRow, mapCategoryRow } from "./threads.types.js";


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