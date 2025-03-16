import { AppDataSource } from "../utils/db";
import {Category} from "../entities/Category";

export const CategoryRepository = AppDataSource.getRepository(Category);
