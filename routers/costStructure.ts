import { Request, Response, Router } from "express";
import { CategoryRecord } from "../record/category.record";
import { pool } from "../utils/db";
import { RowDataPacket } from "mysql2";

interface CategoryTotal {
  id: string;
  category: string;
  total: Number;
}
export const costStructureRouter = Router();

costStructureRouter
  .get("/", async (req: Request, res: Response) => {
    try {
      const user_email = req.body.user_email || "tester@testowy.test";

      const [resultsFromDb] = (await pool.execute(
        "SELECT categories.id_category AS id, categories.category_name AS category, SUM(value) AS total FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? AND types.type_name = 'Koszt' GROUP BY categories.category_name",
        [user_email]
      )) as RowDataPacket[];

      if (!resultsFromDb) {
        return res
          .status(404)
          .json({ error: "Brak danych dla podanych parametrów." });
      }
      const allCategories = await CategoryRecord.listAll();

      const resultsWithZeroCategories = allCategories.map((category) => {
        const resultExists = resultsFromDb.find(
          (result: CategoryTotal) => result.category === category.category_name
        );
        return {
          id: category.id_category,
          category: category.category_name,
          total: resultExists ? Number(resultExists.total.toFixed(2)) : 0,
        };
      });

      res.json(resultsWithZeroCategories);
    } catch (error) {
      console.error("Błąd w trakcie przetwarzania zapytania:", error);
      res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
  })
  .post("/", async (req: Request, res: Response) => {
    try {
      const category_name: string = req.body.category_name;
      const insertedId = await new CategoryRecord({ category_name }).insert();
      res.status(201).json({ id: insertedId });
    } catch (error) {
      console.error("Błąd podczas przetwarzania żądania:", error);
      res.status(500).json({ error: "Błąd podczas przetwarzania żądania" });
    }
  })
  .delete("/delete/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const record = (await CategoryRecord.getOne(id)) as CategoryRecord;
      if (!record) {
        res.status(404).json({ error: "Rekord o podanym ID nie istnieje." });
      } else {
        const [result] = (await pool.execute(
          "SELECT COUNT(*) as count FROM `financial_balance` WHERE category = ? AND user_email = ?",
          [record.id_category, record.user_email]
        )) as RowDataPacket[];

        const isCategoryInUse = result[0].count > 0;
        if (isCategoryInUse) {
          res.status(400).json({
            error:
              "Nie można usunąć kategorii, ponieważ jest powiązana z innym rekordem.",
          });
        } else {
          const recordToDelete = new CategoryRecord({ ...record });
          await recordToDelete.delete();
          res.status(204).send();
        }
      }
    } catch (error) {
      console.error("Błąd podczas usuwania rekordu:", error);
      res.status(500).json({ error: "Błąd podczas usuwania rekordu" });
    }
  });

// .delete("/delete/:id", async (req: Request, res: Response) => {
//   const id = req.params.id;
//   try {
//     const record = (await CategoryRecord.getOne(id)) as CategoryRecord;
//     if (!record) {
//       res.status(404).json({ error: "Rekord o podanym ID nie istnieje." });
//     } else {
//       const recordToDelete = new CategoryRecord({ ...record });

//       await recordToDelete.delete();
//       res.status(204).send();
//     }
//   } catch (error) {
//     console.error("Błąd podczas usuwania rekordu:", error);
//     res.status(500).json({ error: "Błąd podczas usuwania rekordu" });
//   }
// });
