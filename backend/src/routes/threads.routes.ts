import { Router } from "express";

export const threadsRouter = Router();

// fetch the list of categories
// 

threadsRouter.get("/categories", async(req, res, next) => {
  try {
    
    const extractListOfCategories = await listCategories();
    res.json({ data: extractListOfCategoreis });

  } catch (error) {
    next(error);
  }
});