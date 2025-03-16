// import { pool } from "../utils/db";
// import { v4 as uuid } from "uuid";
// import { FieldPacket } from "mysql2";
// import { CategoryEntity } from "../types/category.entity";
//
// type CategoryRecordResult = [CategoryRecord[], FieldPacket[]];
//
// class CategoryRecord implements CategoryEntity {
//   id_category: string;
//   user_email?: string;
//   category_name: string;
//   constructor(private readonly obj: CategoryEntity) {
//     this.id_category = obj.id_category!;
//     this.user_email = obj.user_email;
//     this.category_name = obj.category_name;
//   }
//   public static async listAll(user_email: string): Promise<CategoryRecord[]> {
//     const [results] = (await pool.execute(
//       "SELECT * FROM `categories` WHERE user_email=?",
//       [user_email]
//     )) as CategoryRecordResult;
//     return results;
//   }
//   public async insert(user_email: string): Promise<string> {
//     if (!this.id_category) {
//       this.id_category = uuid();
//     }
//
//     this.user_email = user_email;
//
//     await pool.execute(
//       "INSERT INTO `categories` VALUES (:id_category, :user_email, :category_name)",
//       {
//         id_category: this.id_category,
//         user_email: this.user_email,
//         category_name: this.category_name,
//       }
//     );
//     return this.id_category;
//   }
//   public async delete(): Promise<void> {
//     if (!this.id_category) {
//       throw new Error("Cannot delete a record without an ID.");
//     }
//     await pool.execute("DELETE FROM `categories` WHERE id_category = ?", [
//       this.id_category,
//     ]);
//   }
//   public static async getOne(id: string): Promise<CategoryRecord | null> {
//     const [results] = (await pool.execute(
//       "SELECT * FROM `categories` WHERE id_category = ?",
//       [id]
//     )) as CategoryRecordResult;
//     if (results.length === 0) {
//       console.error("No record with this id");
//       return null;
//     }
//     return results[0];
//   }
// }
//
// export { CategoryRecord };
