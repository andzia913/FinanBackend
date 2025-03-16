// import { pool } from "../utils/db";
// import { v4 as uuid } from "uuid";
// import { FieldPacket } from "mysql2";
// import { BalanceEntity, SumOfCostsAndIncomes } from "../types/balance.entity";
//
// type BalanceRecordResult = [BalanceRecord[], FieldPacket[]];
// type TotalIncomeResult = [{ totalIncome: number }[], FieldPacket[]];
// type TotalCostResult = [{ totalCost: number }[], FieldPacket[]];
//
// export class BalanceRecord implements BalanceEntity {
//   id?: string;
//   user_email?: string;
//   id_type: string;
//   type_name: string;
//   date: Date;
//   value: number;
//   category_name: string;
//   id_category: string;
//   comment: string;
//   planned?: number;
//   constructor(private readonly obj: BalanceEntity) {
//     this.id = obj.id;
//     this.user_email = obj.user_email;
//     this.id_type = obj.id_type;
//     this.type_name = obj.type_name;
//     this.date = obj.date;
//     this.value = obj.value;
//     this.category_name = obj.category_name;
//     this.id_category = obj.id_category;
//     this.comment = obj.comment;
//     this.planned = obj.planned;
//   }
//   public static async listAll(user_email: string): Promise<BalanceRecord[]> {
//     const [results] = (await pool.execute(
//       "SELECT financial_balance.*, types.type_name, types.id_type, categories.category_name, categories.id_category FROM `financial_balance` LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? ORDER BY financial_balance.date DESC",
//       [user_email]
//     )) as BalanceRecordResult;
//     return results.map((obj) => new BalanceRecord(obj));
//   }
//   public static async getSumOfCostsAndIncomes(
//     user_email: string
//   ): Promise<SumOfCostsAndIncomes> {
//     const [balanceIncomeSum] = (await pool.execute(
//       "SELECT SUM(financial_balance.value) AS totalIncome FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type WHERE financial_balance.user_email = ? AND types.type_name = 'Przychód'",
//       [user_email]
//     )) as TotalIncomeResult;
//     const [balanceCostSum] = (await pool.execute(
//       "SELECT SUM(financial_balance.value) AS totalCost FROM financial_balance LEFT JOIN `types` ON financial_balance.type = types.id_type WHERE financial_balance.user_email = ? AND types.type_name = 'Koszt'",
//       [user_email]
//     )) as TotalCostResult;
//     return {
//       balanceCostSum: balanceCostSum[0].totalCost,
//       balanceIncomeSum: balanceIncomeSum[0].totalIncome,
//     };
//   }
//
//   public static async getOne(id: string): Promise<BalanceRecord | null> {
//     const [results] = (await pool.execute(
//       "SELECT financial_balance.*, types.type_name, types.id_type, categories.category_name, categories.id_category FROM `financial_balance` LEFT JOIN `types` ON financial_balance.type = types.id_type LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.id = ?",
//       [id]
//     )) as BalanceRecordResult;
//
//     if (results.length === 0) {
//       console.error("No record with this id");
//       return null;
//     }
//     return results[0];
//   }
//
//   public async insert(user_email: string): Promise<string> {
//     if (!this.id) {
//       this.id = uuid();
//     }
//
//     this.user_email = user_email;
//
//     if (!this.planned) {
//       this.planned = this.date > new Date() ? 1 : 0;
//     }
//
//     await pool.execute(
//       "INSERT INTO `financial_balance` VALUES(:id, :user_email, :type, :date, :value, :category, :comment, :planned)",
//       {
//         id: this.id,
//         user_email: this.user_email,
//         type: this.id_type,
//         date: this.date,
//         value: this.value,
//         category: this.id_category,
//         comment: this.comment,
//         planned: this.planned,
//       }
//     );
//     return this.id;
//   }
//
//   public async delete(): Promise<void> {
//     if (!this.id) {
//       throw new Error("Cannot delete a record without an ID.");
//     }
//
//     await pool.execute("DELETE FROM `financial_balance` WHERE id = ?", [
//       this.id,
//     ]);
//   }
//
//   public async update(updatedData: Partial<BalanceEntity>): Promise<void> {
//     if (!this.id) {
//       throw new Error("Cannot update a record without an ID.");
//     }
//
//     await pool.execute(
//       "UPDATE `financial_balance` SET type = :type, date = :date, value = :value, category = :category, comment = :comment WHERE id = :id",
//       {
//         id: this.id,
//         type: updatedData.id_type || this.id_type,
//         date: updatedData.date || this.date,
//         value: updatedData.value || this.value,
//         category: updatedData.id_category || this.id_category,
//         comment: updatedData.comment || this.comment,
//       }
//     );
//   }
// }
