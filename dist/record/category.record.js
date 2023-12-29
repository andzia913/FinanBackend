"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRecord = void 0;
const db_1 = require("../utils/db");
const uuid_1 = require("uuid");
class CategoryRecord {
    constructor(obj) {
        this.obj = obj;
        this.id_category = obj.id_category;
        this.user_email = obj.user_email;
        this.category_name = obj.category_name;
    }
    static async listAll(user_email) {
        const [results] = (await db_1.pool.execute("SELECT * FROM `categories` WHERE user_email=?", [user_email]));
        return results;
    }
    async insert(user_email) {
        if (!this.id_category) {
            this.id_category = (0, uuid_1.v4)();
        }
        this.user_email = user_email;
        await db_1.pool.execute("INSERT INTO `categories` VALUES (:id_category, :user_email, :category_name)", {
            id_category: this.id_category,
            user_email: this.user_email,
            category_name: this.category_name,
        });
        return this.id_category;
    }
    async delete() {
        if (!this.id_category) {
            throw new Error("Cannot delete a record without an ID.");
        }
        await db_1.pool.execute("DELETE FROM `categories` WHERE id_category = ?", [
            this.id_category,
        ]);
    }
    static async getOne(id) {
        const [results] = (await db_1.pool.execute("SELECT * FROM `categories` WHERE id_category = ?", [id]));
        if (results.length === 0) {
            console.error("No record with this id");
            return null;
        }
        return results[0];
    }
}
exports.CategoryRecord = CategoryRecord;
