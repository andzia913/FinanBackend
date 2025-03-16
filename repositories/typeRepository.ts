import { AppDataSource } from "../utils/db";
import {Type} from "../entities/Type";

export const TypeRepository = AppDataSource.getRepository(Type);
