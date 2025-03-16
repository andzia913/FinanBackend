import { BalanceRepository } from "../repositories/balanceRepository";
import { Balance } from "../entities/Balance";
import { User } from "../entities/User";
import { SumOfCostsAndIncomes } from "../types/balance.entity";
import { AppDataSource } from "../utils/db";

export class BalanceService {
    static async listAll(user: User): Promise<Balance[]> {
        return await BalanceRepository.find({
            where: { user },
            relations: ["category", "type"],
            order: { date: "DESC" },
        });
    }

    static async getSumOfCostsAndIncomes(user: User): Promise<SumOfCostsAndIncomes> {
            const balanceRepository = AppDataSource.getRepository(Balance);

            const balanceIncomeSum = await balanceRepository
                .createQueryBuilder("b")
                .innerJoin("b.type", "t")
                .select("SUM(b.value)", "totalIncome")
                .where("b.userId = :userId", { userId: user.id })
                .andWhere("t.name = :typeName", { typeName: "Przychód" })
                .getRawOne();

            const balanceCostSum = await balanceRepository
                .createQueryBuilder("b")
                .innerJoin("b.type", "t")
                .select("SUM(b.value)", "totalCost")
                .where("b.userId = :userId", { userId: user.id })
                .andWhere("t.name = :typeName", { typeName: "Koszt" })
                .getRawOne();

            return {
                balanceCostSum: balanceCostSum?.totalCost || 0,
                balanceIncomeSum: balanceIncomeSum?.totalIncome || 0,
            };
    }

    static async getOne(id: number): Promise<Balance | null> {
        return await BalanceRepository.findOne({
            where: { id },
            relations: ["category", "type"],
        });
    }

    static async insert(user: User, balanceData: Partial<Balance>): Promise<Balance> {
        const newBalance = BalanceRepository.create({
            ...balanceData,
            user,
            planned: balanceData.date && balanceData.date > new Date() ? 1 : 0,
        });
        return await BalanceRepository.save(newBalance);
    }

    static async delete(id: number): Promise<void> {
        await BalanceRepository.delete(id);
    }

    static async update(id: number, updatedData: Partial<Balance>): Promise<void> {
        await BalanceRepository.update(id, updatedData);
    }
}
