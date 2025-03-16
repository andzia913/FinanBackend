import { GoalRepository } from "../repositories/goalRepository";
import { User } from "../entities/User";
import { Goal } from "../entities/Goal";
import { AppDataSource } from "../utils/db";
import { v4 as uuid } from "uuid";

export class GoalService {
    static async listAllWithSum(user: User): Promise<any[]> {
        const goals = await GoalRepository.find({ where: { user } });
        const sumOfGoals = await GoalService.calculateSum(user.email);
        return GoalService.mergeGoalsWithSum(goals, sumOfGoals);
    }

    private static mergeGoalsWithSum(goals: Goal[], sumOfGoals: any[]): any[] {
        return goals.map((goal) => {
            const result = sumOfGoals.find((sum) => sum.goal_name === goal.goal_name);
            return {
                id: goal.id,
                goal_name: goal.goal_name,
                value: goal.value,
                date: goal.date,
                currValue: result ? Number(result.currValue.toFixed(2)) : 0,
            };
        });
    }

    private static async calculateSum(user_email: string): Promise<any[]> {
        return await AppDataSource.manager.query(
            `SELECT SUM(value) AS currValue, comment AS goal_name
             FROM financial_balance
                      LEFT JOIN categories ON financial_balance.category = categories.id_category
             WHERE financial_balance.user_email = ?
               AND categories.category_name = 'Cele oszczędnościowe'
             GROUP BY financial_balance.comment`,
            [user_email]
        );
    }

    static async insert(user: User, goalData: Partial<Goal>): Promise<Goal> {
        const newGoal = GoalRepository.create({ ...goalData, user });
        return await GoalRepository.save(newGoal);
    }

    static async addDedicatedAmount(user: User, goal_name: string, value: number): Promise<void> {
        const entityManager = AppDataSource.manager;

        const existingCategory = await entityManager.query(
            "SELECT id_category FROM categories WHERE user_email = ? AND category_name = 'Cele oszczędnościowe'",
            [user.email]
        );

        let categoryId: string;
        if (!existingCategory[0]) {
            categoryId = uuid();
            await entityManager.query(
                "INSERT INTO `categories` VALUES (?, ?, ?)",
                [categoryId, user.email, "Cele oszczędnościowe"]
            );
        } else {
            categoryId = existingCategory[0].id_category;
        }

        await entityManager.query(
            "INSERT INTO `financial_balance` VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
            [uuid(), user.email, "52595e0d-5dee-11ee-9aec-9828a608d513", new Date(), value, categoryId, goal_name, 0]
        );
    }
}
