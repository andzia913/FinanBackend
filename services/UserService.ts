import { UserRepository } from "../repositories/userRepository";
import { User } from "../entities/User";

export class UserService {
    static async getOne(email: string): Promise<User | null> {
        return await UserRepository.findOneBy({ email });
    }

    static async listAll(): Promise<User[]> {
        return await UserRepository.find();
    }

    static async insert(newUser: User): Promise<void> {
        await UserRepository.save(newUser);
    }

    static async delete(email: string): Promise<void> {
        await UserRepository.delete({ email });
    }
}
