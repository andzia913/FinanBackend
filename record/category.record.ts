import {pool} from "../utils/db";
import {v4 as uuid} from'uuid';
import {FieldPacket} from "mysql2";
import { CategoryEntity } from "../types/category.entity";

type CategoryRecordResult = [CategoryRecord[], FieldPacket[]]

class CategoryRecord implements CategoryEntity{
    id_category: number;
    user_mail?: string;
    category_name: string;
    constructor(private readonly obj: CategoryEntity){
        this.id_category = obj.id_category;
        this.user_mail = obj.user_mail;
        this.category_name = obj.category_name
    }
    public static async listAll(): Promise<CategoryRecord[]> {
        const [results] = (await pool.execute(
            "SELECT * FROM `categories`")) as CategoryRecordResult;
        return results.map(obj => new CategoryRecord(obj));
    }
    

}

export { CategoryRecord }