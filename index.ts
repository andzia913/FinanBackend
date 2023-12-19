import * as express from "express";
import { Request, Response } from "express";
import "express-async-errors";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
const session = require("express-session");
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import { mainRouter } from "./routers/main";
import { costStructureRouter } from "./routers/costStructure";
import { financialBalanceRouter } from "./routers/financialBalance";
import { cashFlowRouter } from "./routers/cashFlow";
import { financialGoalsRouter } from "./routers/cashGoals";
import { loginRouter } from "./routers/login";
import { registerRouter } from "./routers/register";
import { logoutRouter } from "./routers/logout";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

dotenv.config();
// const app = express();
const app = require("https-localhost")();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.options(
  "*",
  cors({
    preflightContinue: false,
    origin: "https://127.0.0.1:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Access-Control-Request-Headers",
      "Access-Control-Allow-Origin",
    ],
    optionsSuccessStatus: 200,
  })
);

// app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24,
      sameSite: "None",
      httpOnly: false,
      secure: true,
    },
  })
);

app.use("/", mainRouter);
app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/logout", logoutRouter);
app.use("/cost-structure", costStructureRouter);
app.use("/financialBalance", financialBalanceRouter);
app.use("/cashFlow", cashFlowRouter);
app.use("/financialGoals", financialGoalsRouter);

app.listen(5000);
