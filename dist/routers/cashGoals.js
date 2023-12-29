"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashGoalsRouter = void 0;
const express_1 = require("express");
const goal_record_1 = require("../record/goal.record");
const db_1 = require("../utils/db");
const uuid_1 = require("uuid");
exports.cashGoalsRouter = (0, express_1.Router)();
exports.cashGoalsRouter
    .get("/", async (req, res) => {
    const user_email = req.body.user_email;
    const goals = await goal_record_1.GoalRecord.listAllWithSum(user_email);
    console.log("odsyłamy", goals);
    res.json(goals);
})
    .post("/add/dedicated-amount", async (req, res) => {
    try {
        const goal_name = req.body.goal_name;
        const value = req.body.value;
        const user_email = req.body.user_email;
        const [existingCategory] = (await db_1.pool.execute("SELECT id_category FROM categories WHERE user_email = ? AND category_name = 'Cele oszczędnościowe'", [user_email]));
        let categoryId = "";
        if (!existingCategory[0]) {
            const id = (0, uuid_1.v4)();
            await db_1.pool.execute("INSERT INTO `categories` VALUES (:id_category, :user_email, :category_name)", {
                id_category: id,
                user_email: user_email,
                category_name: "Cele oszczędnościowe",
            });
            categoryId = id;
        }
        else {
            categoryId = existingCategory[0].id_category;
        }
        await db_1.pool.execute("INSERT INTO `financial_balance` VALUES(:id, :user_email, :type, :date, :value, :category, :comment, :planned)", {
            id: (0, uuid_1.v4)(),
            user_email: user_email,
            type: "52595e0d-5dee-11ee-9aec-9828a608d513",
            date: new Date(),
            value: value,
            category: categoryId,
            comment: goal_name,
            planned: 0,
        });
        res.status(201).json({ message: "Dedicated amount added successfully" });
    }
    catch (error) {
        console.error("Błąd podczas przetwarzania żądania:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
    .post("/add", async (req, res) => {
    try {
        const user_email = req.body.user_email;
        const goalData = req.body;
        if (!goalData.value || !goalData.goal_name || !goalData.date) {
            res.status(401).json({ message: "Invalid data" });
            return;
        }
        const insertedId = await new goal_record_1.GoalRecord({
            goal_name: goalData.goal_name,
            value: goalData.value,
            date: goalData.date,
        }).insert(user_email);
        res.status(201).json({ id: insertedId });
    }
    catch (error) {
        console.error("Błąd podczas przetwarzania żądania:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
