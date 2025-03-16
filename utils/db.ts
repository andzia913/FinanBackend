import "reflect-metadata";
import { DataSource } from "typeorm";
import {User} from "../entities/User";
import {Balance} from "../entities/Balance";
import {Category} from "../entities/Category";
import {Goal} from "../entities/Goal";
import {Type} from "../entities/Type";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: process.env.DB_PASSWORD,
  database: "budget_app",
  synchronize: true,
  logging: true,
  entities: [User, Balance, Goal, Type, Category],
  migrations: ['../migrations/*.ts'],
});

