"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.costStructureRouter = void 0;
const express_1 = require("express");
const category_record_1 = require("../record/category.record");
const db_1 = require("../utils/db");
exports.costStructureRouter = (0, express_1.Router)();
exports.costStructureRouter
    .get("/", async (req, res) => {
    try {
        const user_email = req.body.user_email;
        const [resultsFromDb] = (await db_1.pool.execute("SELECT categories.id_category AS id, categories.category_name AS category, SUM(value) AS total FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? AND types.type_name = 'Koszt' GROUP BY categories.category_name", [user_email]));
        if (!resultsFromDb) {
            return res
                .status(404)
                .json({ error: "No data for the provided parameters." });
        }
        const allCategories = await category_record_1.CategoryRecord.listAll(user_email);
        const resultsWithZeroCategories = allCategories.map((category) => {
            const resultExists = resultsFromDb.find((result) => result.category === category.category_name);
            return {
                id: category.id_category,
                category: category.category_name,
                total: resultExists ? Number(resultExists.total.toFixed(2)) : 0,
            };
        });
        res.json(resultsWithZeroCategories);
    }
    catch (error) {
        console.error("Błąd w trakcie przetwarzania zapytania:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
    .post("/", async (req, res) => {
    try {
        const user_email = req.body.user_email;
        const category_name = req.body.category_name;
        if (!category_name) {
            res.status(401).json({ message: "Invalid data" });
            return;
        }
        const insertedId = await new category_record_1.CategoryRecord({ category_name }).insert(user_email);
        res.status(201).json({ id: insertedId });
    }
    catch (error) {
        console.error("Błąd podczas przetwarzania żądania:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
    .delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const record = (await category_record_1.CategoryRecord.getOne(id));
        if (!record) {
            res
                .status(404)
                .json({ error: "Record with the provided ID does not exist." });
        }
        else {
            const [result] = (await db_1.pool.execute("SELECT COUNT(*) as count FROM `financial_balance` WHERE category = ? AND user_email = ?", [record.id_category, record.user_email]));
            const isCategoryInUse = result[0].count > 0;
            if (isCategoryInUse) {
                res.status(400).json({
                    error: "Cannot delete the category as it is associated with another record.",
                });
            }
            else {
                const recordToDelete = new category_record_1.CategoryRecord({ ...record });
                await recordToDelete.delete();
                res.status(204).json({ success: true });
            }
        }
    }
    catch (error) {
        console.error("Błąd podczas usuwania rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
