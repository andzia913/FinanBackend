"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
require("express-async-errors");
const dotenv = __importStar(require("dotenv"));
const main_1 = require("./routers/main");
const costStructure_1 = require("./routers/costStructure");
const financialBalance_1 = require("./routers/financialBalance");
const cashFlow_1 = require("./routers/cashFlow");
const cashGoals_1 = require("./routers/cashGoals");
const login_1 = require("./routers/login");
const register_1 = require("./routers/register");
const jwt = require("jsonwebtoken");
const app = require("https-localhost")();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/login", login_1.loginRouter);
app.use("/register", register_1.registerRouter);
app.use((req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.sendStatus(401);
    }
    jwt.verify(token.replace("Bearer ", ""), process.env.SECRET_KEY, (err, tokenData) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.body.user_email = tokenData.mail;
        next();
    });
});
app.use("/", main_1.mainRouter);
app.use("/cost-structure", costStructure_1.costStructureRouter);
app.use("/financialBalance", financialBalance_1.financialBalanceRouter);
app.use("/cashFlow", cashFlow_1.cashFlowRouter);
app.use("/cash-goals", cashGoals_1.cashGoalsRouter);
app.listen(5000);
