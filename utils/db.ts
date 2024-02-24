import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "localhost",
  user: process.env.DB_USER,
  database: "budget_app",
  password: process.env.DB_PASSWORD,
  namedPlaceholders: true,
  decimalNumbers: true,
  port: 3306,
});
