import { Request, Response, Router } from "express";
import { GoalRecord } from "../record/goal.record";
import { GoalEntity } from "../types/goal.entity";
import { pool } from "../utils/db";
import { v4 as uuid } from "uuid";
import { RowDataPacket } from "mysql2/promise";

export const cashGoalsRouter = Router();

cashGoalsRouter
  .get("/", async (req: Request, res: Response) => {
    const user_email = req.body.user_email;
    const goals = await GoalRecord.listAllWithSum(user_email);
    res.json(goals);
  })
  .post("/add/dedicated-amount", async (req: Request, res: Response) => {
    try {
      const goal_name = req.body.goal_name;
      const value = req.body.value;
      const user_email = req.body.user_email;

      const [existingCategory] = (await pool.execute(
        "SELECT id_category FROM categories WHERE user_email = ? AND category_name = 'Cele oszczędnościowe'",
        [user_email]
      )) as RowDataPacket[];

      let categoryId = "";
      if (!existingCategory[0]) {
        const id = uuid();
        await pool.execute(
          "INSERT INTO `categories` VALUES (:id_category, :user_email, :category_name)",
          {
            id_category: id,
            user_email: user_email,
            category_name: "Cele oszczędnościowe",
          }
        );
        categoryId = id;
      } else {
        categoryId = existingCategory[0].id_category;
      }

      await pool.execute(
        "INSERT INTO `financial_balance` VALUES(:id, :user_email, :type, :date, :value, :category, :comment, :planned)",
        {
          id: uuid(),
          user_email: user_email,
          type: "52595e0d-5dee-11ee-9aec-9828a608d513",
          date: new Date(),
          value: value,
          category: categoryId,
          comment: goal_name,
          planned: 0,
        }
      );

      res.status(201).json({ message: "Dedicated amount added successfully" });
    } catch (error) {
      console.error("Błąd podczas przetwarzania żądania:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
  .post("/add", async (req: Request, res: Response) => {
    try {
      const user_email = req.body.user_email;
      const goalData = req.body;
      if (!goalData.value || !goalData.goal_name || !goalData.date) {
        res.status(401).json({ message: "Invalid data" });
        return;
      }
      const insertedId = await new GoalRecord({
        goal_name: goalData.goal_name,
        value: goalData.value,
        date: goalData.date,
      }).insert(user_email);
      res.status(201).json({ id: insertedId });
    } catch (error) {
      console.error("Błąd podczas przetwarzania żądania:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
