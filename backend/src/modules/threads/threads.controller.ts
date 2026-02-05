import catchErrors from "../../utils/catchErrors.js";
import { listCategories } from "./threads.repository.js";


export const getCategoriesHandler = catchErrors(
  async(_req, res, _next) => {
    const extractListOfCategories = await listCategories();
    res.json({ data: extractListOfCategories });
});