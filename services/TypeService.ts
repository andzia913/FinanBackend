import { TypeRepository } from "../repositories/typeRepository";
import { Type } from "../entities/Type";

export class TypeService {

    static async listAll(): Promise<Type[]> {
        return await TypeRepository.find();
    }

}
