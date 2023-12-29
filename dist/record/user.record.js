"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../utils/db");
class UserRecord {
    constructor(obj) {
        this.obj = obj;
        this.email = '';
        this.isAdmin = 0;
        this.password = '';
        this.name = '';
        this.email = obj.email;
        this.password = obj.password;
        this.name = obj.name;
        this.isAdmin = obj.isAdmin;
    }
    static async listAll() {
        const [results] = (await db_1.pool.execute("SELECT email, password_hash AS `password`, is_admin AS `isAdmin`, name FROM `users`"));
        return results.map(obj => new UserRecord(obj));
    }
    static async getOne(email) {
        const [results] = (await db_1.pool.execute("SELECT email, password_hash AS `password`, is_admin AS `isAdmin`, name  FROM `users` WHERE email = :email", { email }));
        return results[0];
    }
    static async insert(newUser) {
        await db_1.pool.execute("INSERT INTO `users` ( email, password_hash, name, is_admin) VALUES ( :email, :password_hash, :name, :is_admin)", { email: newUser.email, password_hash: newUser.password, name: newUser.name, is_admin: newUser.isAdmin });
    }
    static async delete(email) {
        await db_1.pool.execute("DELETE FROM `users` WHERE email = :email", { email });
    }
}
exports.default = UserRecord;
