import { pool } from "../utils/db";
import { v4 as uuid } from "uuid";
import { FieldPacket, RowDataPacket } from "mysql2";
import {
  GoalEntity,
  GoalEntityWithSum,
  SumOfGoals,
} from "../types/goal.entity";

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
  public static async listAllWithSum(user_email): Promise<GoalEntityWithSum[]> {
    const goals = await GoalRecord.listAll(user_email);
    const sumOfGoals = await GoalRecord.calculateSum(user_email);
    const combinedGoals = GoalRecord.mergeGoalsWithSum(goals, sumOfGoals);
    return combinedGoals;
  }
  private static async mergeGoalsWithSum(
    goals: GoalEntity[],
    sumOfGoals: SumOfGoals[]
  ): Promise<GoalEntityWithSum[]> {
    const resultsWithCurrValueOfEachGoal = goals.map((goal) => {
      const resultExists = sumOfGoals.find(
        (result: SumOfGoals) => result.goal_name === goal.goal_name
      );

      return {
        id: goal.id,
        user_email: goal.user_email,
        value: goal.value,
        goal_name: goal.goal_name,
        date: goal.date,
        currValue: resultExists ? Number(resultExists.currValue.toFixed(2)) : 0,
      };
    });

    return resultsWithCurrValueOfEachGoal;
  }

  private static async calculateSum(user_email): Promise<SumOfGoals[]> {
    const [sumOfGoalsFromDb] = (await pool.execute(
      "SELECT SUM(value) AS currValue, comment AS category_name FROM financial_balance LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? AND categories.category_name = 'Cele oszczędnościowe' GROUP BY financial_balance.comment",
      [user_email]
    )) as RowDataPacket[];
    const sumOfGoals: SumOfGoals[] = sumOfGoalsFromDb.map((result) => {
      return {
        currValue: result.currValue,
        goal_name: result.category_name,
      };
    });
    console.log("sumofgoals", sumOfGoals);
    return sumOfGoals;
  }

  public static async listAll(user_email): Promise<GoalEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `goals` WHERE goals.user_email = ?",
      [user_email]
    )) as GoalRecordResult;

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
