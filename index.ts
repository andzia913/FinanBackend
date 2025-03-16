import express from "express";
import "express-async-errors";
import * as dotenv from "dotenv";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import cors from "cors";
const jwt = require("jsonwebtoken");
const path = require("path");
import { mainRouter } from "./routers/main";
import { costStructureRouter } from "./routers/costStructure";
import { financialBalanceRouter } from "./routers/financialBalance";
import { cashFlowRouter } from "./routers/cashFlow";
import { cashGoalsRouter } from "./routers/cashGoals";
import { loginRouter } from "./routers/login";
import { registerRouter } from "./routers/register";
import { Request } from "express";
import {AppDataSource} from "./utils/db";
import {addInitialData} from "./services/dataSeeder";

const app = express();

dotenv.config();
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "http://localhost:5173",
      "https://appvps.pl",
    ],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

process.env.MODE === "dev" &&
  app.use(express.static(path.join(__dirname, "client/build")));

app.use("/login", loginRouter);
app.use("/register", registerRouter);

interface TokenData {
  mail: string;
}
app.use((req: Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.SECRET_KEY,
    (err: JsonWebTokenError, tokenData: TokenData) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.body.user_email = tokenData.mail;
      next();
    }
  );
});

app.use("/", mainRouter);
app.use("/costStructure", costStructureRouter);
app.use("/financialBalance", financialBalanceRouter);
app.use("/cashFlow", cashFlowRouter);
app.use("/cashGoals", cashGoalsRouter);

AppDataSource.initialize()
    .then(() => {
        console.log("Połączono z bazą danych");
        addInitialData().then(r => app.listen(5000));
    })
    .catch((error) => console.error("Błąd połączenia:", error));

