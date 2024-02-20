"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceRecord = void 0;
const db_1 = require("../utils/db");
const uuid_1 = require("uuid");
class BalanceRecord {
    constructor(obj) {
        this.obj = obj;
        this.id = obj.id;
        this.user_email = obj.user_email;
        this.id_type = obj.id_type;
        this.type_name = obj.type_name;
        this.date = obj.date;
        this.value = obj.value;
        this.category_name = obj.category_name;
        this.id_category = obj.id_category;
        this.comment = obj.comment;
        this.planned = obj.planned;
    }
    static async listAll(user_email) {
        const [results] = (await db_1.pool.execute("SELECT financial_balance.*, types.type_name, types.id_type, categories.category_name, categories.id_category FROM `financial_balance` LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? ORDER BY financial_balance.date DESC", [user_email]));
        return results.map((obj) => new BalanceRecord(obj));
    }
    static async getSumOfCostsAndIncomes(user_email) {
        const [balanceIncomeSum] = (await db_1.pool.execute("SELECT SUM(financial_balance.value) AS totalIncome FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type WHERE financial_balance.user_email = ? AND types.type_name = 'Przychód'", [user_email]));
        const [balanceCostSum] = (await db_1.pool.execute("SELECT SUM(financial_balance.value) AS totalCost FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type WHERE financial_balance.user_email = ? AND types.type_name = 'Koszt'", [user_email]));
        return {
            balanceCostSum: balanceCostSum[0].balanceCostSum,
            balanceIncomeSum: balanceIncomeSum[0].balanceIncomeSum,
        };
    }
    static async getOne(id) {
        const [results] = (await db_1.pool.execute("SELECT financial_balance.*, types.type_name, types.id_type, categories.category_name, categories.id_category FROM `financial_balance` LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.id = ?", [id]));
        if (results.length === 0) {
            console.error("No record with this id");
            return null;
        }
        return results[0];
    }
    async insert(user_email) {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
        this.user_email = user_email;
        if (!this.planned) {
            this.planned = this.date > new Date() ? 1 : 0;
        }
        await db_1.pool.execute("INSERT INTO `financial_balance` VALUES(:id, :user_email, :type, :date, :value, :category, :comment, :planned)", {
            id: this.id,
            user_email: this.user_email,
            type: this.id_type,
            date: this.date,
            value: this.value,
            category: this.id_category,
            comment: this.comment,
            planned: this.planned,
        });
        return this.id;
    }
    async delete() {
        if (!this.id) {
            throw new Error("Cannot delete a record without an ID.");
        }
        await db_1.pool.execute("DELETE FROM `financial_balance` WHERE id = ?", [
            this.id,
        ]);
    }
    async update(updatedData) {
        if (!this.id) {
            throw new Error("Cannot update a record without an ID.");
        }
        await db_1.pool.execute("UPDATE `financial_balance` SET type = :type, date = :date, value = :value, category = :category, comment = :comment WHERE id = :id", {
            id: this.id,
            type: updatedData.id_type || this.id_type,
            date: updatedData.date || this.date,
            value: updatedData.value || this.value,
            category: updatedData.id_category || this.id_category,
            comment: updatedData.comment || this.comment,
        });
    }
}
exports.BalanceRecord = BalanceRecord;
