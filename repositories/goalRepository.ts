import { AppDataSource } from "../utils/db";
import {Goal} from "../entities/Goal";

export const GoalRepository = AppDataSource.getRepository(Goal);
