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
const jwt = require("jsonwebtoken");

const app = require("https-localhost")();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/login", loginRouter);
app.use("/register", registerRouter);

app.use((req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(
    token.replace("Bearer ", ""),
    process.env.SECRET_KEY,
    (err, tokenData) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.body.user_email = tokenData.mail;
      next();
    }
  );
});

app.use("/", mainRouter);
app.use("/cost-structure", costStructureRouter);
app.use("/financialBalance", financialBalanceRouter);
app.use("/cashFlow", cashFlowRouter);
app.use("/cash-goals", cashGoalsRouter);

app.listen(5000);
