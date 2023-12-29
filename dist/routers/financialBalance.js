"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financialBalanceRouter = void 0;
const express_1 = require("express");
const balance_record_1 = require("../record/balance.record");
const category_record_1 = require("../record/category.record");
const type_record_1 = require("../record/type.record");
exports.financialBalanceRouter = (0, express_1.Router)();
exports.financialBalanceRouter
    .get("/types", async (req, res) => {
    const types = await type_record_1.TypeRecord.listAll();
    res.json(types);
})
    .get("/categories", async (req, res) => {
    const user_mail = req.body.user_email;
    const categories = await category_record_1.CategoryRecord.listAll(user_mail);
    res.json(categories);
})
    .get("/get-one/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const record = await balance_record_1.BalanceRecord.getOne(id);
        if (record) {
            res.json(record);
        }
        else {
            res
                .status(404)
                .json({ error: "Record with the provided ID does not exist." });
        }
    }
    catch (error) {
        console.error("Błąd podczas pobierania rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
    .get("/", async (req, res) => {
    const user_email = req.body.user_email;
    const financialBalance = await balance_record_1.BalanceRecord.listAll(user_email);
    const { balanceIncomeSum, balanceCostSum } = await balance_record_1.BalanceRecord.getSumOfCostsAndIncomes(user_email);
    res.json({
        financialBalance,
        balanceCostSum,
        balanceIncomeSum,
    });
})
    .post("/add", async (req, res) => {
    try {
        const user_email = req.body.user_email;
        const formData = req.body;
        const insertedId = await new balance_record_1.BalanceRecord(formData).insert(user_email);
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
        const record = await balance_record_1.BalanceRecord.getOne(id);
        if (!record) {
            res
                .status(404)
                .json({ error: "Record with the provided ID does not exist." });
        }
        else {
            const recordToDelete = new balance_record_1.BalanceRecord(record);
            await recordToDelete.delete();
            res.status(204).json({ success: true });
        }
    }
    catch (error) {
        console.error("Błąd podczas usuwania rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})
    .put("/update/:id", async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
        const isRecord = await balance_record_1.BalanceRecord.getOne(id);
        if (!isRecord) {
            res
                .status(404)
                .json({ error: "Record with the provided ID does not exist." });
        }
        else if (isRecord.category_name === "Cele oszczędnościowe") {
            res.status(403).json({
                message: "Editing the 'Cele oszczędnościowe' category is prohibited.",
            });
        }
        else {
            const recordToUpdate = new balance_record_1.BalanceRecord(isRecord);
            await recordToUpdate.update(updatedData);
            res.status(200).json({ success: true });
        }
    }
    catch (error) {
        console.error("Błąd podczas aktualizacji rekordu:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
