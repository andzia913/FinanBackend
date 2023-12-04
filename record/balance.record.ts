import {pool} from "../utils/db";
import {v4 as uuid} from'uuid';
import {FieldPacket} from "mysql2";
import {BalanceEntity} from "../types/balance.entity";

type BalanceRecordResult = [BalanceRecord[], FieldPacket[]]


export class BalanceRecord implements BalanceEntity{
    id?: string;
    user_email?: string;
    id_type: string;
    type_name: string;
    date: Date;
    value: number;
    category_name: string;
    id_category: string;
    comment: string;
    planned?: number;
    constructor(private readonly obj: BalanceEntity) {
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
    public static async listAll(): Promise<BalanceRecord[]> {
        const [results] = (await pool.execute(
            "SELECT financial_balance.*, types.type_name, types.id_type, categories.category_name, types.id_type FROM `financial_balance` LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category ORDER BY financial_balance.date DESC")) as BalanceRecordResult;
        // console.log(results.map(obj => new BalanceRecord(obj)));
        return results.map(obj => new BalanceRecord(obj));
    }
    public static async getOne(id: string): Promise<BalanceRecord | null> {
      const [results] = (await pool.execute(
        "SELECT financial_balance.*, types.type_name, types.id_type, categories.category_name, types.id_type FROM `financial_balance` LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.id = ?",
        [id]
      )) as BalanceRecordResult;
    
      if (results.length === 0) {
        console.error('No record with this id')
        return null;
      }
    
      return new BalanceRecord(results[0]);
    }
    
    public async insert():Promise<string> {
        if (!this.id) {
            this.id = uuid();
        }
        if (!this.user_email){
            this.user_email = 'tester@testowy.test'
        }
        if (!this.planned){
            this.planned = this.date > new Date() ? 1: 0;
        }

        await pool.execute("INSERT INTO `financial_balance` VALUES(:id, :user_email, :type, :date, :value, :category, :comment, :planned)", {
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
      
    public async delete(): Promise<void> {
          if (!this.id) {
            throw new Error('Cannot delete a record without an ID.');
          }
      
          await pool.execute('DELETE FROM `financial_balance` WHERE id = ?', [this.id]);
        }
      
    public async update(updatedData: Partial<BalanceEntity>): Promise<void> {
          if (!this.id) {
            throw new Error('Cannot update a record without an ID.');
          }
          const validUpdates: Partial<BalanceEntity> = {};
          for (const key in updatedData) {
            if (updatedData[key] !== null && updatedData[key] !== undefined) {
              validUpdates[key] = updatedData[key];
            }
          }
      
          if (Object.keys(validUpdates).length === 0) {
            throw new Error('No valid updates provided.');
          }
      
          const updateQuery = 'UPDATE `financial_balance` SET ' + Object.keys(validUpdates).map((key) => `${key} = ?`).join(', ') + ' WHERE id = ?';
          const updateValues = [...Object.values(validUpdates), this.id];
      
          await pool.execute(updateQuery, updateValues);
        }
}
  