import { CategoryRepository } from "../repositories/categoryRepository";
import { Category } from "../entities/Category";
import { User } from "../entities/User";

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
}
