import { Request, Response, Router } from "express";
import { BalanceService } from "../services/BalanceService";
import { CategoryService } from "../services/CategoryService";
import { TypeService } from "../services/TypeService";
import { UserService } from "../services/UserService";

export const financialBalanceRouter = Router();

financialBalanceRouter
    .get("/types", async (_req: Request, res: Response) => {
      try {
        const types = await TypeService.listAll();
        res.json(types);
      } catch (error) {
        console.error("Błąd podczas pobierania typów:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    .get("/categories", async (req: Request, res: Response) => {
      try {
        const userEmail = req.body.user_email;
        const user = await UserService.getOne(userEmail);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const categories = await CategoryService.listAll(user);
        res.json(categories);
      } catch (error) {
        console.error("Błąd podczas pobierania kategorii:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    .get("/get-one/:id", async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const record = await BalanceService.getOne(id);
        if (record) {
          res.json(record);
        } else {
          res.status(404).json({ message: "Record not found." });
        }
      } catch (error) {
        console.error("Błąd podczas pobierania rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    .get("/", async (req: Request, res: Response) => {
      try {
        const userEmail = req.body.user_email;
        const user = await UserService.getOne(userEmail);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const financialBalance = await BalanceService.listAll(user);
        const { balanceIncomeSum, balanceCostSum } = await BalanceService.getSumOfCostsAndIncomes(user);

        res.json({ financialBalance, balanceCostSum, balanceIncomeSum });
      } catch (error) {
        console.error("Błąd podczas pobierania danych:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    .post("/add", async (req: Request, res: Response) => {
      try {
        const userEmail = req.body.user_email;
        const user = await UserService.getOne(userEmail);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const formData = req.body;
        const newRecord = await BalanceService.insert(user, formData);
        res.status(201).json({ id: newRecord.id });
      } catch (error) {
        console.error("Błąd podczas dodawania rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    .delete("/delete/:id", async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const record = await BalanceService.getOne(id);
        if (!record) {
          return res.status(404).json({ message: "Record not found." });
        }

        await BalanceService.delete(id);
        res.status(204).send();
      } catch (error) {
        console.error("Błąd podczas usuwania rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    })

    .put("/update/:id", async (req: Request, res: Response) => {
      try {
        const id = parseInt(req.params.id);
        const updatedData = req.body;
        const record = await BalanceService.getOne(id);

        if (!record) {
          return res.status(404).json({ message: "Record not found." });
        }

        if (record.category.name === "Cele oszczędnościowe") {
          return res.status(403).json({ message: "Editing 'Cele oszczędnościowe' category is prohibited." });
        }

        await BalanceService.update(id, updatedData);
        res.status(200).json({ success: true });
      } catch (error) {
        console.error("Błąd podczas aktualizacji rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
