import { Request, Response, Router } from "express";
import { BalanceRecord } from "../record/balance.record";
import { CategoryRecord } from "../record/category.record";
import { TypeRecord } from "../record/type.record";
import { pool } from "../utils/db";

export const financialBalanceRouter = Router();

financialBalanceRouter
  .get("/types", async (req: Request, res: Response) => {
    const types = await TypeRecord.listAll();
    res.json(types);
  })

  .get("/categories", async (req: Request, res: Response) => {
    const categories = await CategoryRecord.listAll();
    res.json(categories);
  })
  .get("/get-one/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const record = await BalanceRecord.getOne(id);
      if (record) {
        res.json(record);
      } else {
        res.status(404).json({ error: "Rekord o podanym id nie istnieje." });
      }
    } catch (error) {
      console.error("Błąd podczas pobierania rekordu:", error);
      res.status(500).json({ error: "Wystąpił błąd serwera." });
    }
  })
  .get("/", async (req: Request, res: Response) => {
    const user_email = req.body.user_mail
      ? req.body.user_email
      : "tester@testowy.test";
    const financialBalance = await BalanceRecord.listAll(user_email);

    const [balanceIncomeSum] = await pool.execute(
      "SELECT SUM(financial_balance.value) AS totalIncome FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type WHERE financial_balance.user_email = ? AND types.type_name = 'Przychód'",
      [user_email]
    );
    const [balanceCostSum] = await pool.execute(
      "SELECT SUM(financial_balance.value) AS totalCost FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type WHERE financial_balance.user_email = ? AND types.type_name = 'Koszt'",
      [user_email]
    );
    res.json({
      financialBalance,
      balanceCostSum: balanceCostSum[0],
      balanceIncomeSum: balanceIncomeSum[0],
    });
  })
  .post("/add", async (req: Request, res: Response) => {
    console.log("próbuje dodać na backendzie ");
    try {
      const formData = req.body;
      const insertedId = await new BalanceRecord(formData).insert();

      //   const insertedId = formData;
      res.status(201).json({ id: insertedId });
    } catch (error) {
      console.error("Błąd podczas przetwarzania żądania:", error);
      res.status(500).json({ error: "Błąd podczas przetwarzania żądania" });
    }
  })
  .delete("/delete/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const record = await BalanceRecord.getOne(id);
      if (!record) {
        res.status(404).json({ error: "Rekord o podanym ID nie istnieje." });
      } else {
        const recordToDelete = new BalanceRecord(record);
        await recordToDelete.delete();
        res.status(204).send();
      }
    } catch (error) {
      console.error("Błąd podczas usuwania rekordu:", error);
      res.status(500).json({ error: "Błąd podczas usuwania rekordu" });
    }
  })
  .put("/update/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;

    try {
      const isRecord = await BalanceRecord.getOne(id);

      if (!isRecord) {
        res.status(404).json({ error: "Rekord o podanym ID nie istnieje." });
      } else {
        const recordToUpdate = new BalanceRecord(isRecord);
        await recordToUpdate.update(updatedData);
        res.status(200).json({ message: "Rekord zaktualizowany pomyślnie." });
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji rekordu:", error);
      res.status(500).json({ error: "Błąd podczas aktualizacji rekordu" });
    }
  });
