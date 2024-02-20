"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeRecord = void 0;
const db_1 = require("../utils/db");
class TypeRecord {
    constructor(obj) {
        this.obj = obj;
        this.id_type = obj.id_type;
        this.type_name = obj.type_name;
    }
    static async listAll() {
        const [results] = (await db_1.pool.execute("SELECT * FROM `types`"));
        return results.map((obj) => new TypeRecord(obj));
    }
}
exports.TypeRecord = TypeRecord;
