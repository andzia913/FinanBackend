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
        console.log("user", user);
        return BalanceRepository
            .createQueryBuilder("b")
            .innerJoin("b.category", "c")
            .innerJoin("b.user", "u")
            .where("b.user.id = :userId", {userId: user.id})
            .groupBy("b.category.id")
            .select("b.category.id", "categoryId")
            .addSelect("c.name", "categoryName")
            .addSelect("SUM(b.value)", "value")
            .getRawMany();
    }

}
