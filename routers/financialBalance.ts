import { Request, Response, Router } from "express";
import { BalanceRecord } from "../record/balance.record";
import { CategoryRecord } from "../record/category.record";
import { TypeRecord } from "../record/type.record";

export const financialBalanceRouter = Router();

financialBalanceRouter
  .get("/types", async (req: Request, res: Response) => {
    const types = await TypeRecord.listAll();
    res.json(types);
  })

  .get("/categories", async (req: Request, res: Response) => {
    const user_mail = req.body.user_email;
    const categories = await CategoryRecord.listAll(user_mail);
    res.json(categories);
  })
  .get("/get-one/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const record = await BalanceRecord.getOne(id);
      if (record) {
        res.json(record);
      } else {
        res
          .status(404)
          .json({ error: "Record with the provided ID does not exist." });
      }
    } catch (error) {
      console.error("Błąd podczas pobierania rekordu:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  .get("/", async (req: Request, res: Response) => {
    const user_email = req.body.user_email;
    const financialBalance = await BalanceRecord.listAll(user_email);

    const { balanceIncomeSum, balanceCostSum } =
      await BalanceRecord.getSumOfCostsAndIncomes(user_email);
    res.json({
      financialBalance,
      balanceCostSum,
      balanceIncomeSum,
    });
  })
  .post("/add", async (req: Request, res: Response) => {
    try {
      const user_email = req.body.user_email;
      const formData = req.body;
      const insertedId = await new BalanceRecord(formData).insert(user_email);

      res.status(201).json({ id: insertedId });
    } catch (error) {
      console.error("Błąd podczas przetwarzania żądania:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  .delete("/delete/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      const record = await BalanceRecord.getOne(id);
      if (!record) {
        res
          .status(404)
          .json({ error: "Record with the provided ID does not exist." });
      } else {
        const recordToDelete = new BalanceRecord(record);
        await recordToDelete.delete();
        res.status(204).json({ success: true });
      }
    } catch (error) {
      console.error("Błąd podczas usuwania rekordu:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  .put("/update/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
      const isRecord = await BalanceRecord.getOne(id);
      if (!isRecord) {
        res
          .status(404)
          .json({ error: "Record with the provided ID does not exist." });
      } else if (isRecord.category_name === "Cele oszczędnościowe") {
        res.status(403).json({
          message: "Editing the 'Cele oszczędnościowe' category is prohibited.",
        });
      } else {
        const recordToUpdate = new BalanceRecord(isRecord);
        await recordToUpdate.update(updatedData);
        res.status(200).json({ success: true });
      }
    } catch (error) {
      console.error("Błąd podczas aktualizacji rekordu:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
