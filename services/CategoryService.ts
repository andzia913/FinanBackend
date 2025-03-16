import {CategoryRepository} from "../repositories/categoryRepository";
import {Category} from "../entities/Category";
import {User} from "../entities/User";
import {Balance} from "../entities/Balance";
import {BalanceRepository} from "../repositories/balanceRepository";

export class CategoryService {
    static async listAll(user: User): Promise<Category[]> {
        return await CategoryRepository.find({ where: { user } });
    }

    static async insert(user: User, name: string): Promise<Category> {
        const newCategory = CategoryRepository.create({ name, user });
        return await CategoryRepository.save(newCategory);
    }

    static async delete(id: number): Promise<void> {
        await CategoryRepository.delete({ id });
    }

    static async getOne(id: number): Promise<Category | null> {
        return await CategoryRepository.findOne({ where: { id } });
    }
    static async getCostStructure(user: User): Promise<Balance[]> {
        return BalanceRepository
                .createQueryBuilder("b")
                .innerJoin("b.category", "c", "c.id = b.categoryId")
                .innerJoin("b.user", "u", "u.id = b.userId")
                .where("b.userId = :userId", {userId: user.id})
                .groupBy("b.categoryId")
                .select("*")
                .addSelect("SUM(b.value)", "value")
                .getRawMany();
        }

}
