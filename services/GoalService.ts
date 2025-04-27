import { GoalRepository } from "../repositories/goalRepository";
import { User } from "../entities/User";
import { Goal } from "../entities/Goal";
import { AppDataSource } from "../utils/db";
import {BalanceService} from "./BalanceService";
import {BalanceRepository} from "../repositories/balanceRepository";
import {CategoryRepository} from "../repositories/categoryRepository";
import {Category} from "../entities/Category";
import {TypeRepository} from "../repositories/typeRepository";

export class GoalService {
    static async listAllWithSum(user: User): Promise<any[]> {
        const goals = await GoalRepository.find({ where: { user } });
        const sumOfGoals = await GoalService.calculateSum(user);
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

    private static async calculateSum(user :User): Promise<any[]> {
        return BalanceRepository
            .createQueryBuilder("b")
            .innerJoin("b.category", "c")
            .innerJoin("b.user", "u")
            .where("b.user.id = :userId", {userId: user.id})
            .andWhere("c.name = :categoryName", { categoryName: "Cele oszczędnościowe" })
            .groupBy("b.comment")
            .getRawMany();
    }


    static async insert(user: User, goalData: Partial<Goal>): Promise<Goal> {
        const newGoal = GoalRepository.create({ ...goalData, user });
        return await GoalRepository.save(newGoal);
    }

    static async addDedicatedAmount(user: User, goal_name: string, value: number): Promise<void> {
        const entityManager = AppDataSource.manager;
        const existingCategory= await CategoryRepository.createQueryBuilder("c").where("c.user.id = :userId", {userId: user.id}).andWhere("c.name = :name" , {name: "Cele oszczędnościowe"}).getOne()

        let category: Category;

        if (!existingCategory) {
            const insertResult = await CategoryRepository.createQueryBuilder("c")
                .insert()
                .into(Category)
                .values({
                    name: "Cele oszczędnościowe",
                    user: user
                })
                .execute();
            //console.log(insertResult);
            const insertedId = insertResult.identifiers[0].id;

            category = await CategoryRepository.findOne({
                where: { id: insertedId }
            });
        } else {
            category = existingCategory;
        }
        const typeEntity = await TypeRepository.findOne({ where: { id: 2 } });

        await BalanceService.insert(user, {
            name: "Cele oszczędnościowe",

            type: typeEntity,
            date: new Date(),
            value: value,
            category: category,
            comment: goal_name
        } )

    }
}
