import { Request, Response, Router } from "express";
import { CategoryRecord } from "../record/category.record";
import { pool } from "../utils/db";
import { RowDataPacket } from "mysql2";

export const costStructureRouter = Router();

costStructureRouter.get("/", async (req: Request, res: Response) => {
  try {
    const user_email = req.body.user_email || "tester@testowy.test";

    const [resultsFromDb] = (await pool.execute(
      "SELECT categories.category_name AS category, SUM(value) AS total FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? AND types.type_name = 'Koszt' GROUP BY categories.category_name",
      [user_email]
    )) as RowDataPacket[];

    if (!resultsFromDb) {
      return res
        .status(404)
        .json({ error: "Brak danych dla podanych parametrów." });
    }
    const results = resultsFromDb.map((result) => ({
      category: result.category,
      total: Number(result.total.toFixed(2)),
    }));
    console.log(results);

    res.json(results);
  } catch (error) {
    console.error("Błąd w trakcie przetwarzania zapytania:", error);
    res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
});
