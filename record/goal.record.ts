import { pool } from "../utils/db";
import { v4 as uuid } from "uuid";
import { FieldPacket } from "mysql2";
import { GoalEntity } from "../types/goal.entity";

type GoalRecordResult = [GoalEntity[], FieldPacket[]];

class GoalRecord implements GoalEntity {
  id?: string;
  user_email?: string;
  value: number;
  goal_name: string;
  date: Date;
  constructor(private readonly obj: GoalEntity) {
    this.id = obj.id;
    this.user_email = obj.user_email;
    this.value = obj.value;
    this.goal_name = obj.goal_name;
    this.date = obj.date;
  }
  public static async listAll(user_email): Promise<GoalEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `goals` WHERE goals.user_email = ?",
      [user_email]
    )) as GoalRecordResult;
    const [sumOfGoals] = await pool.execute(
      "SELECT SUM(value), comment FROM financial_balance LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? AND categories.category_name = 'Cele oszczędnościowe' GROUP BY financial_balance.comment",
      [user_email]
    );
    console.log(sumOfGoals);
    return results.map((obj) => new GoalRecord(obj));
  }
  public async insert(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
    }
    if (!this.user_email) {
      this.user_email = "tester@testowy.test";
    }

    await pool.execute(
      "INSERT INTO `goals` VALUES(:id, :user_email, :value, :goal_name, :date )",
      {
        id: this.id,
        user_email: this.user_email,
        value: this.value,
        goal_name: this.goal_name,
        date: this.date,
      }
    );
    return this.id;
  }
}

export { GoalRecord };
