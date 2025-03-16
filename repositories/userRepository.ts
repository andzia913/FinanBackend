import { AppDataSource } from "../utils/db";
import { User } from "../entities/User";

export const UserRepository = AppDataSource.getRepository(User);
