"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalRecord = void 0;
const db_1 = require("../utils/db");
const uuid_1 = require("uuid");
class GoalRecord {
    constructor(obj) {
        this.obj = obj;
        this.id = obj.id;
        this.user_email = obj.user_email;
        this.value = obj.value;
        this.goal_name = obj.goal_name;
        this.date = obj.date;
    }
    static async listAllWithSum(user_email) {
        const goals = await GoalRecord.listAll(user_email);
        const sumOfGoals = await GoalRecord.calculateSum(user_email);
        const combinedGoals = GoalRecord.mergeGoalsWithSum(goals, sumOfGoals);
        return combinedGoals;
    }
    static async mergeGoalsWithSum(goals, sumOfGoals) {
        const resultsWithCurrValueOfEachGoal = goals.map((goal) => {
            const resultExists = sumOfGoals.find((result) => result.goal_name === goal.goal_name);
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
    static async calculateSum(user_email) {
        const [sumOfGoalsFromDb] = (await db_1.pool.execute("SELECT SUM(value) AS currValue, comment AS goal_name FROM financial_balance LEFT JOIN `categories` ON financial_balance.category = categories.id_category WHERE financial_balance.user_email = ? AND categories.category_name = 'Cele oszczędnościowe' GROUP BY financial_balance.comment", [user_email]));
        const sumOfGoals = sumOfGoalsFromDb.map((result) => {
            return {
                currValue: result.currValue,
                goal_name: result.goal_name,
            };
        });
        return sumOfGoals;
    }
    static async listAll(user_email) {
        const [results] = (await db_1.pool.execute("SELECT * FROM `goals` WHERE goals.user_email = ?", [user_email]));
        return results.map((obj) => new GoalRecord(obj));
    }
    async insert(user_email) {
        if (!this.id) {
            this.id = (0, uuid_1.v4)();
        }
        this.user_email = user_email;
        await db_1.pool.execute("INSERT INTO `goals` VALUES(:id, :user_email, :value, :goal_name, :date )", {
            id: this.id,
            user_email: this.user_email,
            value: this.value,
            goal_name: this.goal_name,
            date: this.date,
        });
        return this.id;
    }
}
exports.GoalRecord = GoalRecord;
