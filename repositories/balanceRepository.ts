import { AppDataSource } from "../utils/db";
import { Balance } from "../entities/Balance";

export const BalanceRepository = AppDataSource.getRepository(Balance);
