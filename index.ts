import * as express from "express";
import "express-async-errors";
import * as dotenv from "dotenv";
import { mainRouter } from "./routers/main";
import { costStructureRouter } from "./routers/costStructure";
import { financialBalanceRouter } from "./routers/financialBalance";
import { cashFlowRouter } from "./routers/cashFlow";
import { cashGoalsRouter } from "./routers/cashGoals";
import { loginRouter } from "./routers/login";
import { registerRouter } from "./routers/register";
import { Request } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import * as cors from "cors";
const jwt = require("jsonwebtoken");

const app = express();

dotenv.config();
app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.listen(5000);
