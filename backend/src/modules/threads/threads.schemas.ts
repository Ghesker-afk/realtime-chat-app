import { z } from "zod";

export const createThreadSchema = z.object({
  title: z.string().trim().min(5).max(255),
  body: z.string().trim().min(20).max(2500),
  categorySlug: z.string().trim().min(1)
});